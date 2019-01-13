const { Client } = require('pg');
const { selectQueryString,
  insertQueryString } = require('./queryStringHelpers');
//   updateQueryString,
//   deleteQueryString } = require('./queryStringHelpers');

const client = new Client({
  database: 'prof_serv',
  port: 5432,
});

client.connect();


// Returns a promise that resolves in the selection query results
const getFromDb = conditions => {
  return client.query(selectQueryString(conditions))
    .then(selectResults => selectResults.rows)
    .catch(() => console.log('ERROR GETTING RESTAURANT GIVEN CONDITIONS.'));
};


// Posts (inserts) a new restaurant into the db with a unique restaurant Id.
const postToDb = rest => {
  return client.query(insertQueryString(rest))
    .then(console.log)
    .catch(() => console.log('ERROR INSERTING RESTAURANT.'));
};


// const updateInDb = () => {

// };

// const deleteFromDb = () => {

// };

module.exports = {
  getFromDb,
  postToDb,
  // updateInDb,
  // deleteFromDb,
};
