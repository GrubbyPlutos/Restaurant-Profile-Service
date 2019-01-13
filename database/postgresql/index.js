const { Client } = require('pg');
const { selectQueryString,
  insertQueryString,
  updateQueryString,
  deleteQueryString } = require('./queryStringHelpers');

const client = new Client({
  database: 'profile_service',
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
    .catch(() => console.log('ERROR INSERTING RESTAURANT.'));
};


// Updates restaurant records that match specific 'selectors' to whatever 'updateChanges' keys indicate.
const updateInDb = ({ selectors, updateChanges }) => {
  return client.query(updateQueryString(selectors, updateChanges))
    .catch(() => console.log('ERROR UPDATING RESTAURANT.'));
};


// Deletes a restaurant with a given id
const deleteFromDb = ({ selectors }) => {
  return client.query(deleteQueryString(selectors))
    .catch(() => console.log('ERROR IN DELETING RESTAURANT.'));
};


module.exports = {
  getFromDb,
  postToDb,
  updateInDb,
  deleteFromDb,
};
