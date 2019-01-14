CREATE DATABASE profile_service;

\c profile_service;

CREATE TABLE restaurants (id SERIAL PRIMARY KEY, name varchar(255), address varchar(255), number varchar(50), picture varchar(500), stars smallint, quality smallint, delivery smallint, accuracy smallint);

COPY restaurants (name, address, number, picture, stars, quality, delivery, accuracy)
FROM '<filepath>/dataNoId.csv'  DELIMITER ',' CSV HEADER;

INSERT INTO restaurants (name, address, number, picture, stars, quality, delivery, accuracy) VALUES ("Bogan - Dickinson","75661 Evie Valley","(136) 765-9593","http://lorempixel.com/640/480/food",1,67,10,38);
