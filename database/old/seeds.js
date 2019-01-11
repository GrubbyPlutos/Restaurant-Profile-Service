const mysql = require('mysql');
const mysqlConfig = require('./config.js');
//const db = require('../database');
const faker = require('faker');

const db = mysql.createConnection(mysqlConfig);

let getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

for (let i = 0; i < 100; i++) {
  let companyName = faker.company.companyName();
  let address = faker.address.streetAddress();
  let number = faker.phone.phoneNumber();
  let picture = faker.image.food();
  let stars = getRandomInt(6);
  let quality = getRandomInt(101);
  let delivery = getRandomInt(101);
  let accuracy = getRandomInt(101);

  let name = faker.name.findName();
  let email = faker.internet.email();

  db.query(`INSERT INTO restaurants (name, address, number, picture, stars, quality, delivery, accuracy) VALUES ("${companyName}","${address}","${number}","${picture}","${stars}", "${quality}", "${delivery}", "${accuracy}");`);
  db.query(`INSERT INTO users (name, email) VALUES ("${name}","${email}");`);
}
