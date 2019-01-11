const mysql = require('mysql');
const mysqlConfig = require('./config.js');

const db = mysql.createConnection(mysqlConfig);

let grabRestaurantInfo = (id, callback) => {
  db.query(`SELECT * FROM restaurants where id=${id}`, (err, res) => {
    if (err) {
      throw err;
    } else {
      callback(res);
    }
  });
};

module.exports = {
  grabRestaurantInfo,
};