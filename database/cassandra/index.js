const cassandra = require('cassandra-driver');
const { selectQueryString,
  insertQueryString, nextIdQueryString, updateNextId,
  updateQueryString,
  deleteQueryString } = require('./queryStringHelpers');

// Connect to the cluster
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'profile_service',
  localDataCenter: 'datacenter1',
  socketOptions: {
    readTimeout: 100000,
  },
});

client.connect((err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
});

// Returns promise that resolves with the selection query results from db if successful.
const getFromDb = conditions => {
  let selectQStr = selectQueryString(conditions);

  return client.execute(selectQStr)
    .then(selectResults => selectResults.rows)
    .catch(() => console.log('ERROR IN GETTING RESTAURANT GIVEN CONDITIONS'));
};


// Posts (inserts) a new restaurant into the db with a unique restaurant Id.
// Returns promise with the insertion results once the database next restaurant id is updated.
const postToDb = rest => {
  let insertResults;

  return client.execute(nextIdQueryString())
    .then(nextIdResults => Number(nextIdResults.rows[0].nextid))
    .catch(() => {
      throw 'ERROR IN GETTING NEXT RESTAURANT ID.';
    })
    .then(nextId => {
      rest.id = nextId;
      return client.execute(insertQueryString(rest));
    })
    .then(insertRes => {
      insertResults = insertRes;
      return;
    })
    .catch(err => {
      throw err === 'ERROR IN GETTING NEXT RESTAURANT ID.' ? err : 'ERROR IN INSERTING RESTAURANT.';
    })
    .then(() => client.execute(updateNextId(rest.id + 1)))
    .then(() => insertResults)
    .catch(err => {
      let errMsg;
      if (err === 'ERROR IN GETTING NEXT RESTAURANT ID.' || err === 'ERROR IN INSERTING RESTAURANT.') {
        errMsg = err;
      } else {
        errMsg = 'ERROR IN UPDATING NEXT RESTAURANT ID.';
      }
      console.log(errMsg);
    });
};


// Updates restaurant records that match specific 'selectors' to whatever 'updateChanges' keys indicate.
// Resolves in the update query results.
const updateInDb = ({ selectors, updateChanges }) => {
  return client.execute(updateQueryString(selectors, updateChanges))
    .catch(updateRestErr => console.log('ERROR IN UPDATING RESTAURANT.'));
};


// Deletes a restaurant with a given id
// Resolves in the delete query results.
const deleteFromDb = ({ selectors }) => {
  return client.execute(deleteQueryString(selectors))
    .catch(deleteRestErr => console.log('ERROR IN DELETING RESTAURANT'));
};


module.exports = {
  getFromDb,
  postToDb,
  updateInDb,
  deleteFromDb,
};
