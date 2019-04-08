alter sequence users_id_seq restart with 1;
-- everyone has same password of pw
insert into USERS (name, username, password, role) values ('customer1', 'customer1', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('customer2', 'customer2', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('customer3', 'customer3', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('admin', 'admin', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'ADMIN');
insert into USERS (name, username, password, role) values ('pizza_owner', 'pizza_owner', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'BRANCH_OWNER'); -- id = 5
insert into USERS (name, username, password, role) values ('kfc_owner', 'kfc_owner', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'BRANCH_OWNER'); -- id = 6
insert into USERS (name, username, password, role) values ('gongcha_owner', 'gongcha_owner', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'BRANCH_OWNER'); -- id = 7
insert into USERS (name, username, password, role) values ('ameens_owner', 'ameens_owner', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'BRANCH_OWNER'); -- id = 8
insert into USERS (name, username, password, role) values ('subway_owner', 'subway_owner', '$2a$04$JMUMXMaA1BdijQT7b0OPP.bD8fyrwjaRvEZIprm.F4dZJC6srO.0y', 'BRANCH_OWNER'); -- id = 9

alter sequence restaurants_id_seq restart with 1;
insert into RESTAURANTS (rName, rPhone, rAddress) values ('Pizza Hut', '3444767495', '13077 Messerschmidt Drive');
insert into RESTAURANTS (rName, rPhone, rAddress) values ('KFC', '4427088748', '6 Cody Drive');
insert into RESTAURANTS (rName, rPhone, rAddress) values ('Gongcha', '1679365024', '022 Loomis Park');
insert into RESTAURANTS (rName, rPhone, rAddress) values ('Ameens', '4809862218', '40669 Saint Paul Place');
insert into RESTAURANTS (rName, rPhone, rAddress) values ('Subway', '2159655239', '1 Nelson Street');

alter sequence branches_id_seq restart with 1;
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('Pizza Hut @ Clementi', 1, 5, '6063075864', '80 Loeprich Lane', '10:00 AM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('KFC @ Kent Ridge', 2, 6, '5197751577', '5 Oxford Terrace', '12:00 PM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('Gongcha @ uTown', 3, 7, '6931442672', '9 Hollow Ridge Trail', '11:00 AM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('Ameens @ Jurong', 4, 8, '3003793180', '24 Goodland Street', '12:30 PM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('Subway @ YIH', 5, 9, '8326702434', '7 Commercial Circle', '11:00 PM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('Pizza Hut @ Tampines', 1, 5, '2687690580', '06 Northfield Parkway', '8:00 PM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('KFC @ NUH', 2, 6, '6644211151', '8279 West Junction', '6:30 AM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('Gongcha @ City Hall', 3, 7, '4729430682', '333 Myrtle Lane', '6:00 AM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('Ameens @ Woodlands', 4, 8, '8518661312', '25 Hansons Junction', '8:15 AM');
insert into BRANCHES (bName, restaurant_id, branch_owner_id, bPhone, bAddress, openingHour) values ('Subway @ Seng Kang', 5, 9, '7666749085', '93798 Gale Junction', '10:00 AM');

alter sequence menuitems_id_seq restart with 1;
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (4, 'Chicken Rice', 'food', 'eastern', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (4 , 'Milk Tea', 'drinks', '', 'contains milk');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (4 , 'Milk Coffee', 'drinks', '', 'contains milk');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (4, 'Plain Prata', 'food', 'indian', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (4, 'Egg Prata', 'food', 'indian', 'contains egg');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (1, 'Pasta', 'food', 'western', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (2 , 'Coke', 'drinks', '', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (4, 'Sweet and Sour Pork', 'food', 'eastern', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (1, 'Teriyaki Chicken', 'food', 'japanese', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (5, 'Nasi Lemak', 'food', 'malay', 'contains nut');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (5, 'Ice Milo', 'drinks', '', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (2, 'Froyo Ice-cream', 'dessert', '', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (1, 'Hawaiian Pizza', 'food', 'western', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (5, 'Lava Cake', 'dessert', '', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (2, '9pc Chicken Wings', 'food', 'western', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (5, 'Takoyaki', 'food', 'japanese', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (3, 'Bingsu', 'dessert', 'korean', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (2, 'Cheese Fries', 'food', 'western', 'contains dairy products');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (5, 'Cupcake', 'dessert', 'western', '');
insert into MENUITEMS (restaurant_id, name, type, cuisine, allergens) values (1, 'Beer', 'drinks', '', '');


insert into FAVOURITES (customer_id, food_id) values (1, 11);
insert into FAVOURITES (customer_id, food_id) values (1, 7);
insert into FAVOURITES (customer_id, food_id) values (1, 7);
insert into FAVOURITES (customer_id, food_id) values (2, 15);
insert into FAVOURITES (customer_id, food_id) values (2, 4);
insert into FAVOURITES (customer_id, food_id) values (3, 2);
insert into FAVOURITES (customer_id, food_id) values (3, 14);
insert into FAVOURITES (customer_id, food_id) values (3, 1);


insert into SELLS (bid, mid, price) values (1, 6, '$6.00');
insert into SELLS (bid, mid, price) values (1, 9, '$5.00');
insert into SELLS (bid, mid, price) values (1, 13, '$9.00');
insert into SELLS (bid, mid, price) values (2, 7, '$1.00');
insert into SELLS (bid, mid, price) values (2, 12, '$4.00');
insert into SELLS (bid, mid, price) values (2, 15, '$10.00');
insert into SELLS (bid, mid, price) values (3, 17, '$4.00');
insert into SELLS (bid, mid, price) values (4, 1, '$4.00');
insert into SELLS (bid, mid, price) values (4, 2, '$0.50');
insert into SELLS (bid, mid, price) values (4, 3, '$0.50');
insert into SELLS (bid, mid, price) values (4, 4, '$1.00');
insert into SELLS (bid, mid, price) values (5, 10, '$4.00');
insert into SELLS (bid, mid, price) values (5, 11, '$1.00');
insert into SELLS (bid, mid, price) values (6, 6, '$6.00');
insert into SELLS (bid, mid, price) values (6, 9, '$5.00');
insert into SELLS (bid, mid, price) values (6, 13, '$9.00');
insert into SELLS (bid, mid, price) values (7, 7, '$1.00');
insert into SELLS (bid, mid, price) values (7, 12, '$4.00');
insert into SELLS (bid, mid, price) values (7, 15, '$10.00');
insert into SELLS (bid, mid, price) values (8, 17, '$4.00');
insert into SELLS (bid, mid, price) values (9, 1, '$4.00');
insert into SELLS (bid, mid, price) values (9, 2, '$0.50');
insert into SELLS (bid, mid, price) values (9, 3, '$0.50');
insert into SELLS (bid, mid, price) values (9, 4, '$1.00');
insert into SELLS (bid, mid, price) values (10, 10, '$4.00');
insert into SELLS (bid, mid, price) values (10, 11, '$1.00');

create or replace function populateTimeslots(b_id integer, slots integer)
returns void as $$
declare
  dates date ARRAY := array[current_date, current_date + interval '1 day', current_date + interval '2 days'];
  currentdate date;
begin
  foreach currentdate in array dates
  loop
    insert into TIMESLOT (branch_id, dateslot, timeslot, numSlots) values (b_id, currentdate, '10:00:00', slots);
    insert into TIMESLOT (branch_id, dateslot, timeslot, numSlots) values (b_id, currentdate, '12:00:00', slots);
    insert into TIMESLOT (branch_id, dateslot, timeslot, numSlots) values (b_id, currentdate, '14:00:00', slots);
    insert into TIMESLOT (branch_id, dateslot, timeslot, numSlots) values (b_id, currentdate, '18:00:00', slots);
    insert into TIMESLOT (branch_id, dateslot, timeslot, numSlots) values (b_id, currentdate, '19:00:00', slots);
  end loop;
end;
$$ language PLpgSQL;

select populateTimeslots(1, 15);
select populateTimeslots(2, 10);
select populateTimeslots(3, 10);
select populateTimeslots(4, 8);
select populateTimeslots(5, 4);
select populateTimeslots(6, 5);
select populateTimeslots(7, 7);
select populateTimeslots(8, 7);
select populateTimeslots(9, 20);
select populateTimeslots(10, 25);

alter sequence promotions_id_seq restart with 1;
insert into PROMOTIONS (name, description, promo_code, start_date, end_date, start_timeslot, end_timeslot, is_exclusive, redemption_cost) values
	('Pizza WHAT?!', 'Save up to $50.00 off any second pizza purchased! Valid till 31 March 2019.', 'P001', '2019-02-01', current_date + interval '4 weeks', '00:00:00', '23:59:00', false, 0),
	('1 for you, 1 for me', '1-for-1 for all stores', '1FOR1', '2010-01-01', current_date + interval '4 weeks', '12:00:00', '14:00:00', false, 0),
	('Prata Week!', 'Kosong now comes with eggs!', 'PRATAFLIP', '2019-02-01', current_date + interval '4 weeks', '00:00:00', '23:59:00', true, 1);
	
insert into OFFERS (branch_id, promo_id) values (1, 1), (3, 2), (4, 3), (9, 3);

alter sequence reservations_id_seq restart with 1;
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot, reservedDate, promo_used, confirmed) values (1, 1, 3, '10:00:00', current_date, 1, false);
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot, reservedDate, promo_used, confirmed) values (2, 1, 3, '12:00:00', current_date, 1, false);
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot, reservedDate, promo_used, confirmed) values (3, 2, 2, '12:00:00', current_date, null, true);
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot, reservedDate, promo_used, confirmed) values (1, 4, 5, '18:00:00', current_date, 3, true);
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot, reservedDate, promo_used, confirmed) values (2, 6, 3, '10:00:00', current_date, null, true);
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot, reservedDate, promo_used, confirmed) values (3, 8, 1, '18:00:00', current_date + interval '1 day', null, false);
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot, reservedDate, promo_used, confirmed) values (1, 1, 1, '18:00:00', current_date + interval '1 day', null, false);


alter sequence ratings_id_seq restart with 1;
insert into RATINGS (rating, comments, customer_id, branch_id) values (5, 'Bagus!', 1, 1);
insert into RATINGS (rating, comments, customer_id, branch_id) values (3, 'No comment', 2, 2);
insert into RATINGS (rating, comments, customer_id, branch_id) values (0, 'Bad service.', 3, 3);
insert into RATINGS (rating, comments, customer_id, branch_id) values (4, 'Food is good', 4, 4);
insert into RATINGS (rating, comments, customer_id, branch_id) values (3, 'Kinda meh.', 5, 5);

insert into PointTransactions (reservation_id, customer_id, point, description) values 
	(3, 1, 1, format('A completed reservation at KFC @ Kent Ridge on %s, %s.', (select reservedDate from reservations where id = 3), (select reservedSlot from reservations where id = 3)));
insert into PointTransactions (reservation_id, customer_id, point, description) values 
	(4, 2, 1, format('A completed reservation at KFC @ Kent Ridge on %s, %s.', (select reservedDate from reservations where id = 4), (select reservedSlot from reservations where id = 4)));
insert into PointTransactions (reservation_id, customer_id, point, description) values 
	(5, 3, 1, format('A completed reservation at KFC @ Kent Ridge on %s, %s.', (select reservedDate from reservations where id = 5), (select reservedSlot from reservations where id = 5)));
