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

create or replace function insertNewUserIntoCustomers()
returns trigger as 
$$
begin
	insert into customers(id) values(new.id);
	return new;
end;
$$
language plpgsql;

-- All signed up user is automatically a customer.
create trigger insertNewUserIntoCustomers
	after insert on Users
	for each row 
	execute procedure insertNewUserIntoCustomers();

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

  foreign key(food_id) references MenuItems(id),
  foreign key(customer_id) references Customers(id)
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

