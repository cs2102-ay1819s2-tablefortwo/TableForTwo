drop table if exists Users cascade;
drop table if exists Customers cascade;
drop table if exists Restaurants cascade;
drop table if exists Branches cascade;
drop table if exists MenuItems cascade;
drop table if exists Favourites cascade;
drop table if exists Sells cascade;
drop table if exists Timeslot cascade;
drop table if exists Reservations cascade;
drop table if exists Ratings cascade;
drop table if exists Points cascade;
drop table if exists Promotions cascade;
drop table if exists Offers cascade;

create table Users(
  id serial primary key,
  name varchar(50) not null,
  username varchar(50) unique not null,
  password varchar(200) not null,
  role varchar(20) default 'CUSTOMER' not null
);

create table Customers(
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

  bName     varchar(100),
  bPhone    bigint,
  bAddress  varchar(100), --eg: 1A Kent Ridge Road
  bArea     varchar(100), --eg: South
  openingHour time not null,

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

create table Reservations (
  id        serial primary key,
  customer_id       integer not null,
  branch_id integer not null,
  pax       integer not null,
  reservedSlot  time not null,
  reservedDate  date not null,


  foreign key(customer_id) references Customers(id),
  foreign key(branch_id) references Branches(id),
  foreign key(branch_id, reservedSlot, reservedDate) references Timeslot(branch_id, timeslot, dateslot),
  check (checkAvailability(reservedDate, reservedSlot, branch_id) >= pax)
);

--customer who have already did reservation for this branch cannot make another reservation of the same branch.
create or replace function customerReserveOnceInBranch()
  returns trigger as
$$
declare count numeric;
begin
  select customer_id, branch_id, count(*) into count
  from Resevations r
  group by customer_id
  having new.customer_id = r1.customer_id
     and new.branch_id = r1.branch_id;

  if count = 1 then return null;
  else return new;
  end if;
end;
$$
  language plpgsql;

create trigger reservation_check
  before insert or update on Reservations
  for each row
execute procedure customerReserveOnceInBranch();

create table Ratings(
  id serial primary key,
  rating integer not null,
  comments varchar(50),
  customer_id integer not null,
  branch_id integer not null,

  foreign key(customer_id) references Customers(id),
  foreign key(branch_id) references Branches(id),
  check(rating <= 5 and rating >= 0)
);

--customer who rates the branch must have made a reservation with the branch before
create or replace function checkCustomerRateExistingBranch()
  returns trigger as
$$
declare count numeric;
  begin
  select count(*) into count
  from Resevations r
  where new.customer_id = r.customer_id
    and new.branch_id = r.branch_id;

  if count > 0 then return new;
  else return null;
  end if;
  end;
$$
  language plpgsql;

create trigger rating_check
  before insert or update on Ratings
  for each row
execute procedure checkCustomerRateExistingBranch();

create table Points (
  reservation_id integer unique not null,
  customer_id    integer not null,
  point          integer not null,

  foreign key(reservation_id) references Reservations(id),
  foreign key(customer_id) references Users(id)
);

create table Promotions (
  id              serial primary key,
  name 			  varchar(100),
  description     text,
  promo_code	  varchar(50) unique,
  visibility		  boolean default true,

  start_date      date,
  end_date        date,
  start_timeslot  time,
  end_timeslot    time,

  
  check(end_date > start_date),
  check(start_timeslot < end_timeslot)
);

create table Offers (
	branch_id 	integer not null,
	promo_id	integer not null,

	foreign key (branch_id) references Branches,
	foreign key (promo_id) references Promotions
);

