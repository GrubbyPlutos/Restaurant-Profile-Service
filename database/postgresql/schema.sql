CREATE DATABASE profile_service;

\c profile_service;

CREATE TABLE restaurants (id bigint, name varchar(255), address varchar(255), number varchar(50), picture varchar(500), stars smallint, quality smallint, delivery smallint, accuracy smallint, PRIMARY KEY( id ));

COPY restaurants (id, name, address, number, picture, stars, quality, delivery, accuracy)
FROM '<filepath>/data.csv'  DELIMITER ',' CSV HEADER;
