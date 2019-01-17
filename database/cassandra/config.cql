CREATE KEYSPACE profile_service WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1 };

USE profile_service;

CREATE TABLE restaurant (id bigint PRIMARY KEY, name text, address text, number text, picture text, stars int, quality int, delivery int, accuracy int)

COPY restaurant (id, name, address, number, picture, stars, quality, delivery, accuracy) FROM '<filepath>/data.csv';

CREATE INDEX restaurant_names ON restaurant( name );

CREATE INDEX id_idx ON restaurant( id );

CREATE TABLE nextIdTable (name text PRIMARY KEY, nextId bigint);

INSERT INTO nextIdTable (name, nextId) VALUES ('next', 10000001);
