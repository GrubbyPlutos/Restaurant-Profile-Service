DROP DATABASE IF EXISTS fec;

CREATE DATABASE fec;

USE fec;

CREATE TABLE restaurants (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  number varchar(255) NOT NULL DEFAULT '',
  picture varchar(255) NOT NULL,
  stars int NOT NULL,
  quality int NOT NULL,
  delivery int NOT NULL,
  accuracy int NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  PRIMARY KEY(id)
);

-- Execute this file from the command line by typing:
--  *    mysql -u <USER> -p < schema.sql
