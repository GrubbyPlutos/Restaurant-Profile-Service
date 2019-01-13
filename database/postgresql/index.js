const { Client } = require('pg');
const { selectQueryString } = require('./queryStringHelpers');

const client = new Client({
  database: 'prof_serv',
  port: 5432,
});

client.connect();

// Returns a promise that resolves in the selection query results
const getFromDb = conditions => {
  return client.query(selectQueryString(conditions))
    .then(selectResults => selectResults.rows)
    .catch(console.log);
};

module.exports = {
  getFromDb,
};
