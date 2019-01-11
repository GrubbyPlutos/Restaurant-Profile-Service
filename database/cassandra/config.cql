CREATE KEYSPACE profile_service WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1 };

USE profile_service;

CREATE TABLE restaurant (id bigint PRIMARY KEY, name text, address text, number text, picture text, stars int, quality int, delivery int, accuracy int)

COPY restaurant (id, name, address, number, picture, stars, quality, delivery, accuracy) FROM '/Users/jjsurfer7/Desktop/HackReactor/Week8/SDC/profile/database/data/data.csv';
