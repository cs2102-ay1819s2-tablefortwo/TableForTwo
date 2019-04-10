DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

--#################### DATABASE FUNCTIONS ####################--
----- FUNCTIONS FOR SEARCH FEATURE -----
create EXTENSION if not exists pg_trgm;
create or replace function
  inlineMax(val1 real, val2 real)
returns real
as $$
begin
  if val1 > val2 then
    return val1;
  end if;
  return val2;
end;
$$
language plpgsql;
----- END -----

----- TRIGGER FUNCTION TO ALLOCATE ROLES FOR NEW USERS -----
-- All signed up user is automatically a customer and this includes BRANCH_OWNER and ADMIN.
create or replace function allocateRolesToNewUsers()
returns trigger as 
$$
begin
	insert into customers(id) values(new.id);
	if new.role = 'BRANCH_OWNER' then
		insert into branchowner(id) values(new.id);
	end if;

	return new;
end;
$$
language plpgsql;
----- END -----

----- FUNCTION TO ENSURE RESTAURANT MAKES THE FOOD BEFORE BRANCH CAN SELL IT -----
create or replace function checkRestaurantSellThisFood(mid integer, bid integer)
returns boolean as $$
declare restaurant_id_involved integer;
begin
	select id into restaurant_id_involved from restaurants where id = (select restaurant_id from branches where id = bid);
	if exists (
		select 1
		from Restaurants r inner join MenuItems m on r.id = m.restaurant_id
		where r.id = restaurant_id_involved
		and m.id = mid
	) then return true;

      Else 
         Return false;
      End if;
end
$$ language PLpgSQL;
----- END -----


----- FUNCTION TO CHECK THE AVAILABILITY OF A CERTAIN TIMESLOT AND DATE IN A CERTAIN BRANCH -----
create or replace function checkAvailability(rDate date, rSlot time, b_id integer)
returns integer as $$
declare
  totalReserved integer;
  slots integer;
begin
	select coalesce(sum(pax), 0) into totalReserved
	from Reservations
	where reservedSlot = rSlot
	and reservedDate = rDate
  and branch_id = b_id;

	select numSlots into slots
	from Timeslot
	where branch_id = b_id
	and Timeslot.dateslot = rDate
	and Timeslot.timeslot = rSlot;
	raise notice 'slots %, total reserved %', slots, totalReserved;
	return slots - totalReserved;
end;
$$ language PLpgSQL;
----- END -----


----- TRIGGER FUNCTION TO ENSURE THE VALID USE OF PROMOTION WHEN RESERVATION IS CREATED OR UPDATED -----

-- If the user has specified a promo_code to use, then check the following:
-- 	1) Ensure such a promotion exist.
-- 	2) If the promotion is exclusive, check whether the user owns the promotion. 
--  3) Check if promotion is available for current branch.
--  4) Check if promotion is still active. (Whether or not the promotion is used within the stipulated time)
create or replace function ensureValidPromoUsage()
returns trigger as
$$
declare
	is_promo_exclusive boolean;
begin
	select is_exclusive into is_promo_exclusive from promotions where promo_code = new.promo_used;
	if new.promo_used isnull then
		return new;
	elseif not exists (select 1 from promotions p where new.promo_used = p.promo_code)
		or (is_promo_exclusive and
		not exists (select 1 from redemption r
			where (select promo_code from promotions where id = r.promo_id) = new.promo_used and r.customer_id = new.customer_id)) then
		raise exception 'No such promotion, %', new.promo_used;
	elsif not exists (select 1 from promotions p inner join offers o on p.id = o.promo_id 
				  where p.promo_code = new.promo_used and new.branch_id = o.branch_id) then
		raise exception 'Promotion is not available for this branch';
	elsif not (new.reservedDate >= (select start_date from promotions where promo_code = new.promo_used) and
		   new.reservedDate <= (select end_date from promotions where promo_code = new.promo_used) and
		   new.reservedSlot >= (select start_timeslot from promotions where promo_code = new.promo_used) and
		   new.reservedSlot <= (select end_timeslot from promotions where promo_code = new.promo_used)) then
		raise exception 'Promotion is currently not available';
	else
		return new;
	end if;
end
$$ language PLpgSQL;
----- END -----


----- TRIGGER FUNCTIONS TO MAINTAIN THE POINT TRANSACTIONS -----

-- This function will be used as a trigger when a reservation is confirmed by a BRANCH_OWNER.
-- Once the reservation is confirmed, the user that booked the reservation will receive a point via 
-- a trigger after the reservation confirmation. 
-- The points will only get recorded when the below constraints are satisfied:
-- 	1) When the reservation's "confirmed" attribute is set to true.
-- 	2) For each reservation, there can only be 1 point allocated to it. So if there is an existing 
--     point allocated to that reservation, no further points will be allocated.
create or replace function logPointTransactionWhenReservationConfirmed()
returns trigger as
$$
declare branch_involved varchar(100); 
begin
	if new.confirmed = true and not exists (select 1 from PointTransactions where reservation_id = new.id) then
		select b.bname into branch_involved from branches b where new.branch_id = b.id;
		insert into PointTransactions(reservation_id, customer_id, point, description) values
			(new.id, new.customer_id, 1, format('A completed reservation at %s on %s, %s', branch_involved, new.reservedDate, new.reservedSlot));
	end if;
	return new;
end
$$ language plpgsql;

-- This function will be used as a trigger when an exclusive promotion is redeemed by a user using 
-- the points that they have. Each time a redemption is inserted, that activity will be recorded down in the 
-- point transactions table.
create or replace function logPointTransactionWhenRedeemed()
returns trigger as
$$
declare redemption_cost integer; promo_code varchar(50);
begin
	select p.redemption_cost into redemption_cost from promotions p where p.id = new.promo_id;
	select p.promo_code into promo_code from promotions p where p.id = new.promo_id;
	insert into PointTransactions(customer_id, point, description) values
		(new.customer_id, -1 * redemption_cost, format('Redeemed an exclusive promotion, %s', promo_code));
	return new;
end
$$ language plpgsql;
----- END -----

----- TRIGGER FUNCTIONS TO MAINTAIN REDEMPTION TABLE -----
create or replace function ensurePromoIdOfRedemptionNotNull()
returns trigger as 
$$
begin
	if (new.promo_id isnull) then
		raise exception 'Please specify the promotion that was redeemed';
	else
		return new;
	end if;
end
$$ language plpgsql;

-- The function will be used as a trigger to ensure that user has sufficient points 
-- before he/she can redeem the exclusive promotion.
create or replace function ensureSufficientPointsBeforeRedeem()
returns trigger as
$$
declare
	redemption_cost integer; points_remaining integer; promo_code varchar(50);
begin
	select p.redemption_cost into redemption_cost from promotions p where p.id = new.promo_id;
	select p.promo_code into promo_code from promotions p where p.id = new.promo_id; 
	select coalesce(sum(point), 0) into points_remaining from pointtransactions where customer_id = new.customer_id;
	
	if (redemption_cost > points_remaining) then 
		raise exception 'Not enough points to redeem the exclusive promotion %', promo_code;
	else 
		return new;
	end if;
end
$$ language plpgsql;
----- END -----

----- Customer who have already did reservation for this branch cannot make another reservation of the same branch. -----
create or replace function customerReserveOnceInBranch()
  returns trigger as
$$
begin
  if exists (
      select 1
      from Reservations r1
      where r1.customer_id = new.customer_id
        and r1.branch_id = new.branch_id
        and r1.reservedSlot = new.reservedSlot
        and r1.reservedDate = new.reservedDate) then raise exception 'duplicate reservation detected';
  else return new;
  end if;
end;
$$
  language plpgsql;
----- END -----

----- Customer who rates the branch must have made a reservation with the branch before -----
create or replace function checkCustomerRateExistingBranch()
  returns trigger as
$$
begin
  if exists (
      select 1
      from Reservations r
      where new.customer_id = r.customer_id
        and new.branch_id = r.branch_id)
  then return new;
  else
    raise exception 'customer did not make reservation to this branch';
  end if;
end;
$$
  language plpgsql;
----- END -----

----- FUNCTIONS FOR RECOMMENDATIONS -----
-- Obtain the individual scores and ratings of each branch given the customer -----
create or replace function getCustomerBranchScores(cid integer)
returns table (
	bid		int,
	bname 			varchar(100),
	area_score 		numeric, 
	cuisine_score	numeric, 
	food_score 		numeric, 
	rating 			numeric
) as
$$
begin
	return query
	with BranchAreaScore as (
	select b.id, b.bname, (coalesce(sum(count), 0) / 
		(select count(*) from reservations r where r.customer_id = cid)) * 0.3 score
	from branches b left join CustomerAreaPreference c 
		on b.barea = c.barea and c.customer_id = cid
	group by b.id, b.bname
	order by score desc
), BranchCuisineScore as (
	select b.id, b.bname, (coalesce(sum(count), 0) / 
		((select count(*) from reservations r where r.customer_id = cid) * 
			(select count(*) from branchsells bs where bs.id = b.id))) * 0.3 score
	from branchsells b left join CustomerCuisinePreference p 
		on b.cuisine = p.cuisine and p.customer_id = cid
	group by b.id, b.bname
	order by score desc
), BranchFoodKeywordScore as (
	select b.id, b.bname, (coalesce(sum(count), 0) / 
		(select sum(count) from CustomerMenuKeywordPreference m where m.customer_id = cid)) * 0.1 score
	from BranchSellKeywords b left join CustomerMenuKeywordPreference m 
		on b.menu_keyword = m.menu_keyword 
		and m.customer_id = cid
	group by b.id, b.bname
	order by score desc
) select a.id bid, a.bname, a.score area_score, c.score cuisine_score, f.score food_score, 
		((r.avgrating::numeric) / 5) * 0.3
	from (((BranchAreaScore a inner join BranchCuisineScore c on a.id = c.id)
		inner join BranchFoodKeywordScore f on f.id = a.id)
		inner join BranchRatings r on r.id = a.id);
end
$$ language PLpgSQL;

-- Obtain the recommendation list with their respective recommendation scores.
create or replace function getRecommendations(cid integer)
returns table (
	bid				int,
	bname 			varchar(100),
	area_score 		numeric, 
	cuisine_score	numeric, 
	food_score 		numeric, 
	rating 			numeric,
	final_score		numeric
) as
$$
begin
	return query
	select *, q.area_score + q.cuisine_score + q.food_score + q.rating final_score
	from getCustomerBranchScores(cid) q
	order by final_score desc
	limit 5;
end 
$$ language PLpgSQL;
----- END -----
--#################### END OF DATABASE FUNCTIONS ####################--


--#################### DATABASE SCHEMA ####################--
create type UserRole as enum('CUSTOMER', 'BRANCH_OWNER', 'ADMIN');

create type BranchArea as enum('North', 'South', 'East', 'West', 'Central'); 

create table Users(
  id serial primary key,
  name varchar(50) not null,
  username varchar(50) unique not null,
  password varchar(200) not null,
  role UserRole default 'CUSTOMER' not null
);


create table Customers(
  id integer primary key,
  foreign key(id) references Users(id)
);

create table BranchOwner (
 id integer primary key,
 foreign key(id) references Users(id)
);

create table Restaurants(
  id       serial primary key,
  rName     varchar(100) not null,
  rPhone    bigint,
  rAddress  varchar(100)
);

create table Branches(
  id       serial primary key,
  restaurant_id	integer not null,
  branch_owner_id integer not null,

  bName     varchar(100),
  bPhone    bigint,
  bAddress  varchar(100), --eg: 1A Kent Ridge Road
  bArea     BranchArea, --eg: South
  openingHour time not null,
  
  foreign key(branch_owner_id) references BranchOwner(id),
  foreign key(restaurant_id) references Restaurants(id) on delete cascade
);

create table MenuItems (
  id        serial primary key,
  restaurant_id integer not null,

  name      varchar(100) not null,
  type      varchar(30),  -- eg: food, drinks
  cuisine   varchar(30),  -- eg: western, eastern, japanese
  allergens text,

  foreign key(restaurant_id) references Restaurants(id) on delete cascade
);


create table Favourites(
  customer_id integer not null,
  food_id integer not null,

  foreign key(food_id) references MenuItems(id) on delete cascade,
  foreign key(customer_id) references Customers(id) on delete cascade
);

Create table Sells (
  mid integer not null,
  bid integer not null,
  price money not null,

  primary key(mid, bid),
  foreign key(mid) references MenuItems(id) on delete cascade,
  foreign key(bid) references Branches(id) on delete cascade,

  check(checkRestaurantSellThisFood(mid, bid) = true)
);

create table Timeslot (
  branch_id   integer,
  dateslot    date,
  timeslot    time,
  numSlots    integer not null,

  primary key (branch_id, dateslot, timeslot),
  foreign key (branch_id) references Branches(id) on delete cascade,
  check (numSlots > 0)
);

create table Promotions (
  id				serial primary key,
  name				varchar(100),
  description		text,
  promo_code		varchar(50) unique,
  is_exclusive		boolean default false,
  redemption_cost	integer, -- redemption_cost only applicable when promotion is exclusive.
    
  start_date		date,
  end_date			date,
  start_timeslot	time,
  end_timeslot		time,
  check(end_date > start_date),
  check(start_timeslot < end_timeslot)
);

create table Offers (
	branch_id 	integer not null,
	promo_id	integer not null,
	
	foreign key (branch_id) references Branches on delete cascade,
	foreign key (promo_id) references Promotions on delete cascade
);

create table Reservations (
  id        	serial primary key,
  customer_id   integer not null,
  branch_id 	integer not null,
  pax       	integer not null,
  reservedSlot  time not null,
  reservedDate  date not null,
  promo_used	varchar(50),
  confirmed		boolean default false,
  
  foreign key(promo_used) references Promotions(promo_code) on delete set null,
  foreign key(customer_id) references Customers(id) on delete cascade,
  foreign key(branch_id) references Branches(id) on delete cascade,
  foreign key(branch_id, reservedSlot, reservedDate) references Timeslot(branch_id, timeslot, dateslot),
  check (checkAvailability(reservedDate, reservedSlot, branch_id) >= pax)
);

create table Ratings(
  id serial primary key,
  rating integer not null,
  comments varchar(50),
  customer_id integer not null,
  branch_id integer not null,

  foreign key(customer_id) references Customers(id),
  foreign key(branch_id) references Branches(id),
  unique(customer_id, branch_id),
  check(rating <= 5 and rating >= 0)
);

create table PointTransactions (
  reservation_id 	integer unique,
  customer_id    	integer not null,
  point          	integer not null,
  description    	varchar(200) not null,
  transaction_date	timestamp default current_timestamp,

  foreign key(reservation_id) references Reservations(id),
  foreign key(customer_id) references Users(id)
);

create table Redemption (
  customer_id	integer not null,
  promo_id		integer,
  date_redeemed	timestamp default current_timestamp ,
  
  unique(customer_id, promo_id),
  foreign key(customer_id) references Customers(id) on delete cascade,
  foreign key(promo_id) references Promotions(id) on delete set null
);
--#################### END OF DATABASE SCHEMA ####################--


--#################### DATABASE TRIGGERS ####################--
create trigger allocateRolesToNewUsers
	after insert on Users
	for each row 
	execute procedure allocateRolesToNewUsers();

create trigger ensureValidPromoUsage
	before insert or update on Reservations
	for each row 
	execute procedure ensureValidPromoUsage();

create trigger logPointTransactionWhenReservationConfirmed
	after insert or update on reservations
	for each row 
	execute procedure logPointTransactionWhenReservationConfirmed();

create trigger logPointTransactionWhenRedeemed
	after insert on Redemption
	for each row 
	execute procedure logPointTransactionWhenRedeemed();

create trigger ensurePromoIdOfRedemptionNotNullWhenInsert
	before insert on Redemption
	for each row 
	execute procedure ensurePromoIdOfRedemptionNotNull();

create trigger ensureSufficientPointsBeforeRedeem
	before insert or update on redemption
	for each row
	execute procedure ensureSufficientPointsBeforeRedeem();

create trigger reservation_check
 	before insert or update on Reservations
 	for each row
 	execute procedure customerReserveOnceInBranch();

create trigger rating_check
 	before insert or update on Ratings
 	for each row
 	execute procedure checkCustomerRateExistingBranch();
--#################### END OF DATABASE TRIGGERS ####################--

 
 --#################### DATABASE VIEWS ####################--
 -- Obtain the information of what the branch sells. 
 create view BranchSells as
	select b.id, b.bname, m.name, m.cuisine
	from (branches b inner join sells s on b.id = s.bid) 
		inner join menuitems m on m.id = s.mid;

-- Obtain the branch keywords that they have in their menu.
create view BranchSellKeywords as (
	select b.id, b.bname, unnest(regexp_split_to_array(b.name, ' ')) menu_keyword
		from branchsells b
);

-- obtain the main cuisine type that the branch sells 
create view BranchMainCuisine as (
	with SellsCount as (
		select b.id, b.bname, b.cuisine, count(*) sellsCount
		from branchsells b 
		where b.cuisine is not null and b.cuisine <> ''
		group by b.id, b.bname, b.cuisine
	)
	select s.id branch_id, s.bname, s.cuisine
		from SellsCount s
		where s.sellsCount >= all (
			select s2.sellsCount
			from SellsCount s2
			where s2.id = s.id and s.cuisine <> s2.cuisine
		)
);

-- Obtain the average rating for each branch.
create view BranchRatings as (
	select b.id, b.bname, coalesce(sum(rating) / count(*), 0) avgRating
	from branches b left join ratings on b.id = branch_id
	group by b.id, b.bname
);
	
-- Obtain the number of times that the customer place their reservation in the area.
create view CustomerAreaPreference as
	select r.customer_id, b.barea, count(b.barea)
	from reservations r inner join branches b on r.branch_id = b.id 
	group by r.customer_id, b.barea;

-- Obtain the customer's rating for the reservations that they made.
create view CustomerRatings as 
	select res.customer_id, res.branch_id, rate.rating
	from reservations res inner join ratings rate on res.branch_id = rate.branch_id 
		and res.customer_id = rate.customer_id;
	
-- Count the number of times the customer visited a branch of the main cuisine type 
-- that the branch serve.
create view CustomerCuisinePreference as 
	select r.customer_id, b.cuisine, count(*)
		from reservations r inner join BranchMainCuisine b on b.branch_id = r.branch_id
		group by r.customer_id, b.cuisine;
	
-- Base on the food items that the branch sells, we calculate the the number of times
-- the keyword appear in the food item in which the customer place their reservation.
create view CustomerMenuKeywordPreference as 
	select r.customer_id, unnest(regexp_split_to_array(b.name, ' ')) menu_keyword, count(*) 
	from reservations r inner join BranchSells b on r.branch_id = b.id
	group by r.customer_id, menu_keyword;
--#################### END OF DATABASE VIEWS ####################--

	
