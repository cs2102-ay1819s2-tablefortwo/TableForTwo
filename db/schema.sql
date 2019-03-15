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
  bName     varchar(100),
  bPhone    bigint,
  bAddress  varchar(100), --eg: 1A Kent Ridge Road 
  bArea     varchar(100), --eg: South
  openingHour time not null
);

create table MenuItems (
  id        serial primary key,
  name      varchar(100) not null,
  type      varchar(30),  -- eg: food, drinks
  cuisine   varchar(30),  -- eg: western, eastern, japanese
  allergens text
);


create table Owns (
  branch_id integer primary key,
  restaurant_id integer not null,

  foreign key(restaurant_id) references Restaurants(id) on delete cascade,
  foreign key(branch_id) references Branches(id) on delete cascade
);

create table Creates (
  id serial primary key,
  menu_item_id integer references MenuItems(id),
  restaurant_id integer not null,
  
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
begin
	
	if exists (
          Select 1
          from Owns o natural join Creates c
          Where o.branch_id = bid
          And c.menu_item_id = mid
      ) then return true;

      Else 
         Return false;
      End if;
end
$$ language PLpgSQL;


Create table Sells (
  id serial primary key,
  mid integer not null, 
  bid integer not null,
  price money not null,
  
  foreign key(mid) references MenuItems(id) on delete cascade,
  foreign key(bid) references Branches(id) on delete cascade,

  check(checkRestaurantSellThisFood(mid, bid) = true)
);

create table Timeslot (
  timing  time primary key,
  slotsLeft  integer not null
  
  check (slotsLeft >= 0)
);

create or replace function checkAvailability(timeslot time)
returns integer as $$
declare total integer;
begin
	select count(*) into total from Timeslot
	where Timeslot.timing = timing and timeslot.slotsLeft > 0;
	return total;
end;
$$ language PLpgSQL;
create table Reservations (
  id        serial primary key,
  customer_id       integer not null,
  pax       integer not null,
  timing  time not null,
  
  foreign key(customer_id) references Customers(id),
  foreign key(timing) references Timeslot(timing),
  check (checkAvailability(timing) >= pax)
);

create table Manages (
  branch_id	integer not null,
  Reservation_id integer primary key,
  foreign key (branch_id) references Branches,
  foreign key (reservation_id) references Reservations
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

create table PointAllocations (
  id             serial primary key,
  reservation_id integer unique not null,
  customer_id    integer not null,
  point          integer not null,

  foreign key(reservation_id) references Reservations(id),
  foreign key(customer_id) references Users(id)
);

create table Promotions (
  id              serial primary key,
  branch_id       integer,
  name 			  varchar(100),
  description     text,
  promo_code	  varchar(50) unique,
  visibility		  boolean default true,
  
  start_date      date,
  end_date        date,
  start_timeslot  time,
  end_timeslot    time,
  
  foreign key (branch_id) references Branches,
  check(end_date > start_date and end_date > current_timestamp),
  check(start_timeslot < end_timeslot)
);