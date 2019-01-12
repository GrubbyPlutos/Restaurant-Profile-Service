const cassandra = require('cassandra-driver');
const async = require('async');
const { selectQueryString,
  insertQueryString, nextIdQueryString, updateNextId } = require('./queryStringHelpers');

// Connect to the cluster
const client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'prof_serv', localDataCenter: 'datacenter1'});

// Calls callback when selection query from db is successful.
const get = (conditions, callback) => {
  client.execute(selectQueryString(conditions), (err, results) => {
    if (err) {
      return callback('ERROR IN GETTING RESTAURANT GIVEN CONDITIONS');
    } 
    callback(null, results.rows);
  });
};

// Posts (inserts) a new restaurant into the db with a unique restaurant Id.
const post = (rest, callback) => {
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

// const update = () => {};

// const delete = () => {};

module.exports = {
  get,
  post,
  // update,
  // delete,
};
