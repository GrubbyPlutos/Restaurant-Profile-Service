const cassandra = require('cassandra-driver');
const async = require('async');
const { selectQueryString,
  insertQueryString, nextIdQueryString, updateNextId,
  updateQueryString,
  deleteQueryString } = require('./queryStringHelpers');

// Connect to the cluster
const client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'profile_service', localDataCenter: 'datacenter1'});

// Calls callback when selection query from db is successful.
const getFromDb = (conditions, callback) => {
  client.execute(selectQueryString(conditions), (err, results) => {
    if (err) {
      return callback('ERROR IN GETTING RESTAURANT GIVEN CONDITIONS');
    } 
    callback(null, results.rows);
  });
};

// Posts (inserts) a new restaurant into the db with a unique restaurant Id.
const postToDb = (rest, callback) => {
  client.execute(nextIdQueryString(), (nextIdErr, nextIdResults) => {
    if (nextIdErr) {
      return callback('ERROR IN GETTING NEXT RESTAURANT ID.');
    }

    rest.id = Number(nextIdResults.rows[0].nextid);
    client.execute(insertQueryString(rest), (insertRestErr, insertResults) => {
      if (insertRestErr) {
        return callback('ERROR IN INSERTING RESTAURANT.');
      } 
      
      client.execute(updateNextId(rest.id + 1), updateNextIdErr => {
        if (updateNextIdErr) {
          return callback('ERROR IN UPDATING NEXT RESTAURANT ID.');
        } 
        callback(null, insertResults);
      });
    });

  });
};

// Updates restaurant records that match specific 'selectors' to whatever 'updateChanges' keys indicate.
const updateInDb = ({ selectors, updateChanges }, callback) => {
  client.execute(updateQueryString(selectors, updateChanges), (updateRestErr, updateResults) => {
    if (updateRestErr) {
      return callback('ERROR IN UPDATING RESTAURANT.');
    }
    callback(null, updateResults);
  });
};


// Deletes a restaurant with a given id
const deleteFromDb = ({ selectors }, callback) => {
  client.execute(deleteQueryString(selectors), (deleteRestErr, deleteRestResults) => {
    if (deleteRestErr) {
      return callback('ERROR IN DELETING RESTAURANT');
    }
    callback(null, deleteRestResults);
  });
};


module.exports = {
  getFromDb,
  postToDb,
  updateInDb,
  deleteFromDb,
};
