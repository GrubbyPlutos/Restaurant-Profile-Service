const db = require('../postgresql/index-postgresql-pool');
// const db = require('../cassandra/index-cassandra');
const redis = require('redis');
const { updateRestaurant } = require('./helpers');

cache = redis.createClient({
  post: 6379,
  host: '52.53.170.118'
});
cache.on('connect', function() {
  console.log('Redis client connected!');
});
cache.on('error', (err) => console.log('ERROR CREATING REDIS CACHE.', err));
cache.flushdb((err, succeeded) => console.log('Redis cache cleared'));


// Wraps the database query with an in-memory cache restaurant lookup first.
//  - if successful, respond with the restaurant from the cache query
//  - if not successful, query database and add the restaurant to the in-memory cache
const getWrapper = (id, res) => {
  cache.get(`${id}`, (err, cacheResult) => {
    if (cacheResult) {
      const restaurantResult = JSON.parse(cacheResult);
      res.json(restaurantResult);
    } else {
      db.getFromDb({ id })
        .then(restaurantResult => {
          res.json(restaurantResult);
          cache.set(`${id}`, JSON.stringify(restaurantResult));
        })
        .catch(() => res.status(500));
    }
  });
};


// TODO: Figure out a way to get id of restaurant from database insertion results.
const postWrapper = (body, res) => {
  db.postToDb(body)
    .then(restaurantResult => res.json(restaurantResult));
};


// Makes twoa async calls: 
// - updates restaurant record in database
// - queries the in-memory cache for the restaurant with that id and updates it if possible
const putWrapper = (updates, res) => {
  // Updates the database
  db.updateInDb(updates)
    .then(restaurantResult => res.json(restaurantResult));

  // Updates cache if restaurant in it
  let id = updates.selectors.id;
  cache.get(`${id}`, (err, cacheResult) => {
    if (cacheResult) {
      const restaurant = JSON.parse(cacheResult);
      updateRestaurant(restaurant, updates.updateChanges);
      cache.set(`${id}`, JSON.stringify(restaurant));
    } 
  });
};


// Similar to putWrapper, but with deletion
// TODO: See how to delete single key-value pair in redis
const deleteWrapper = (deleteRest, res) => {
  db.deleteFromDb(deleteRest)
    .then(restaurantResult => res.json(restaurantResult));
};


module.exports = {
  getWrapper,
  postWrapper,
  putWrapper,
  deleteWrapper,
};
