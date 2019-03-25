alter sequence users_id_seq restart with 1;
insert into USERS (name, username, password, role) values ('Crichton Reece', 'creece0', 'NAUA0dH', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Bobina Bassham', 'bbassham1', '7KiCLLnT9Zm5', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Kerr Gonzales', 'kgonzales2', 'VTEKdTpSg1', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Joshua Norsworthy', 'jnorsworthy3', 'N6i0Zpn4ypx8', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Nye Kennaway', 'nkennaway4', 'nVM31lo1', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Ianthe Scotsbrook', 'iscotsbrook5', 'Ym8aNDKs2Lf', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Friedrick Smythin', 'fsmythin6', 'AwbbotTR9bv', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Delmer Beeho', 'dbeeho7', 'rS97pVG4YQ', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Zerk Robroe', 'zrobroe8', '4Snimfy8', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Ashleigh Gatrell', 'agatrell9', 'mtMhwkYsqXi', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Hillard Border', 'hbordera', 'odPjIa', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Carmel Hubner', 'chubnerb', 'ZLX3uur8a', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Hamilton Testro', 'htestroc', 'WqRskIpE', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Rana Zanneli', 'rzannelid', 'A26FEBNZiKl', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Sybyl Lockless', 'slocklesse', 'svw4dG', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Iorgos Heinschke', 'iheinschkef', 'qB7QX4cr', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Guendolen Dellit', 'gdellitg', 'UeUkTL', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Nicola Rings', 'nringsh', 'lDG0H2D', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Cassey Daniaud', 'cdaniaudi', '9RUQzgzpr', 'CUSTOMER');
insert into USERS (name, username, password, role) values ('Maryl Seacroft', 'mseacroftj', 'ZAOXs2ieuZT', 'CUSTOMER');


insert into CUSTOMERS (id) values (1);
insert into CUSTOMERS (id) values (2);
insert into CUSTOMERS (id) values (3);
insert into CUSTOMERS (id) values (4);
insert into CUSTOMERS (id) values (5);
insert into CUSTOMERS (id) values (6);
insert into CUSTOMERS (id) values (7);
insert into CUSTOMERS (id) values (8);
insert into CUSTOMERS (id) values (9);
insert into CUSTOMERS (id) values (10);
insert into CUSTOMERS (id) values (11);
insert into CUSTOMERS (id) values (12);
insert into CUSTOMERS (id) values (13);
insert into CUSTOMERS (id) values (14);
insert into CUSTOMERS (id) values (15);
insert into CUSTOMERS (id) values (16);
insert into CUSTOMERS (id) values (17);
insert into CUSTOMERS (id) values (18);
insert into CUSTOMERS (id) values (19);
insert into CUSTOMERS (id) values (20);


alter sequence restaurants_id_seq restart with 1;
insert into RESTAURANTS (rName, rPhone, rAddress) values ('Pizza Hut', '3444767495', '13077 Messerschmidt Drive');
insert into RESTAURANTS (rName, rPhone, rAddress) values ('KFC', '4427088748', '6 Cody Drive');
insert into RESTAURANTS (rName, rPhone, rAddress) values ('Gongcha', '1679365024', '022 Loomis Park');
insert into RESTAURANTS (rName, rPhone, rAddress) values ('Ameens', '4809862218', '40669 Saint Paul Place');
insert into RESTAURANTS (rName, rPhone, rAddress) values ('Subway', '2159655239', '1 Nelson Street');


alter sequence branches_id_seq restart with 1;
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('Pizza Hut @ Clementi', '6063075864', '80 Loeprich Lane', '10:00 AM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('KFC @ Kent Ridge', '5197751577', '5 Oxford Terrace', '12:00 PM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('Gongcha @ uTown', '6931442672', '9 Hollow Ridge Trail', '11:00 AM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('Ameens @ Jurong', '3003793180', '24 Goodland Street', '12:30 PM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('Subway @ YIH', '8326702434', '7 Commercial Circle', '11:00 PM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('Pizza Hut @ Tampines', '2687690580', '06 Northfield Parkway', '8:00 PM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('KFC @ NUH', '6644211151', '8279 West Junction', '6:30 AM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('Gongcha @ City Hall', '4729430682', '333 Myrtle Lane', '6:00 AM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('Ameens @ Woodlands', '8518661312', '25 Hansons Junction', '8:15 AM');
insert into BRANCHES (bName, bPhone, bAddress, openingHour) values ('Subway @ Seng Kang', '7666749085', '93798 Gale Junction', '10:00 AM');

alter sequence menuitems_id_seq restart with 1;
insert into MENUITEMS (name, type, cuisine, allergens) values ('Chicken Rice', 'food', 'eastern', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Milk Tea', 'drinks', '', 'contains milk');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Milk Coffee', 'drinks', '', 'contains milk');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Plain Prata', 'food', 'indian', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Egg Prata', 'food', 'indian', 'contains egg');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Pasta', 'food', 'western', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Coke', 'drinks', '', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Sweet and Sour Pork', 'food', 'eastern', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Teriyaki Chicken', 'food', 'japanese', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Nasi Lemak', 'food', 'malay', 'contains nut');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Ice Milo', 'drinks', '', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Froyo Ice-cream', 'dessert', '', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Hawaiian Pizza', 'food', 'western', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Lava Cake', 'dessert', '', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('9pc Chicken Wings', 'food', 'western', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Takoyaki', 'food', 'japanese', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Bingsu', 'dessert', 'korean', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Cheese Fries', 'food', 'western', 'contains dairy products');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Cupcake', 'dessert', 'western', '');
insert into MENUITEMS (name, type, cuisine, allergens) values ('Beer', 'drinks', '', '');



insert into OWNS (branch_id, restaurant_id) values (1, 1);
insert into OWNS (branch_id, restaurant_id) values (2, 2);
insert into OWNS (branch_id, restaurant_id) values (3, 3);
insert into OWNS (branch_id, restaurant_id) values (4, 4);
insert into OWNS (branch_id, restaurant_id) values (5, 5);
insert into OWNS (branch_id, restaurant_id) values (6, 1);
insert into OWNS (branch_id, restaurant_id) values (7, 2);
insert into OWNS (branch_id, restaurant_id) values (8, 3);
insert into OWNS (branch_id, restaurant_id) values (9, 4);
insert into OWNS (branch_id, restaurant_id) values (10, 5);


alter sequence creates_id_seq restart with 1;
insert into CREATES (menu_item_id, restaurant_id) values (6, 1);
insert into CREATES (menu_item_id, restaurant_id) values (7, 1);
insert into CREATES (menu_item_id, restaurant_id) values (7, 2);
insert into CREATES (menu_item_id, restaurant_id) values (15, 2);
insert into CREATES (menu_item_id, restaurant_id) values (2, 3);
insert into CREATES (menu_item_id, restaurant_id) values (3, 3);
insert into CREATES (menu_item_id, restaurant_id) values (4, 4);
insert into CREATES (menu_item_id, restaurant_id) values (5, 4);
insert into CREATES (menu_item_id, restaurant_id) values (7, 5);
insert into CREATES (menu_item_id, restaurant_id) values (11, 5);

insert into FAVOURITES (customer_id, food_id) values (2, 11);
insert into FAVOURITES (customer_id, food_id) values (2, 7);
insert into FAVOURITES (customer_id, food_id) values (10, 7);
insert into FAVOURITES (customer_id, food_id) values (10, 15);
insert into FAVOURITES (customer_id, food_id) values (10, 4);
insert into FAVOURITES (customer_id, food_id) values (16, 2);
insert into FAVOURITES (customer_id, food_id) values (17, 14);
insert into FAVOURITES (customer_id, food_id) values (19, 1);


alter sequence sells_id_seq restart with 1;
insert into SELLS (mid, bid, price) values (6, 1, '$3.00');
insert into SELLS (mid, bid, price) values (7, 1, '$0.70');
insert into SELLS (mid, bid, price) values (7, 2, '$2.70');
insert into SELLS (mid, bid, price) values (7, 6, '$18.37');
insert into SELLS (mid, bid, price) values (7, 7, '$1.60');
insert into SELLS (mid, bid, price) values (4, 9, '$5.23');
insert into SELLS (mid, bid, price) values (11, 5, '$16.09');
insert into SELLS (mid, bid, price) values (3, 8, '$5.63');
insert into SELLS (mid, bid, price) values (11, 5, '$16.94');
insert into SELLS (mid, bid, price) values (5, 4, '$9.10');

insert into TIMESLOT (branch_id, timeslot, numSlots) values (1, '10:00:00', 15);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (1, '12:00:00', 15);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (1, '14:00:00', 15);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (1, '16:00:00', 15);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (2, '12:00:00', 10);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (2, '14:00:00', 10);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (3, '12:00:00', 10);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (3, '10:00:00', 10);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (4, '13:00:00', 7);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (4, '18:00:00', 7);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (4, '20:00:00', 7);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (6, '10:00:00', 12);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (7, '10:00:00', 4);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (8, '13:00:00', 1);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (9, '12:00:00', 1);
insert into TIMESLOT (branch_id, timeslot, numSlots) values (10, '12:00:00', 1);


alter sequence reservations_id_seq restart with 1;
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot) values (2, 1, 3, '10:00:00');
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot) values (3, 2, 2, '12:00:00');
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot) values (4, 4, 3, '13:00:00');
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot) values (5, 4, 5, '18:00:00');
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot) values (6, 6, 3, '10:00:00');
insert into RESERVATIONS (customer_id, branch_id, pax, reservedSlot) values (7, 8, 1, '13:00:00');


alter sequence ratings_id_seq restart with 1;
insert into RATINGS (rating, comments, customer_id, branch_id) values (5, 'Bagus!', 1, 1);
insert into RATINGS (rating, comments, customer_id, branch_id) values (3, 'No comment', 2, 2);
insert into RATINGS (rating, comments, customer_id, branch_id) values (0, 'Bad service.', 3, 3);
insert into RATINGS (rating, comments, customer_id, branch_id) values (4, 'Food is good', 4, 4);
insert into RATINGS (rating, comments, customer_id, branch_id) values (3, 'Kinda meh.', 5, 5);

insert into POINTS (reservation_id, customer_id, point) values (1, 2, 1);
insert into POINTS (reservation_id, customer_id, point) values (2, 3, 1);
insert into POINTS (reservation_id, customer_id, point) values (3, 4, 1);
insert into POINTS (reservation_id, customer_id, point) values (4, 5, 1);
insert into POINTS (reservation_id, customer_id, point) values (5, 6, 1);

alter sequence promotions_id_seq restart with 1;
insert into PROMOTIONS (id, branch_id, name, description, start_date, end_date, start_timeslot, end_timeslot) values
(1, 1, 'Pizza WHAT?!', 'Save up to $50.00 off any second pizza purchased! Valid till 31 March 2019.', '2019-02-01', '2019-03-31', '00:00:00', '	24:00:00'),
(2, 3, '1 for you, 1 for me', '1-for-1 for all stores', '2010-01-01', '2020-12-31', '12:00:00', '14:00:00');