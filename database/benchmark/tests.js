const axios = require('axios');
const iterations = 5000;

// Helper to get random number from 1-10M
const get1To10M = () => Math.floor(Math.random() * 10000000);

// Logs the Read average time for querying the server with a certain # of requests.
const getReadAverage = async (dbName, port) => {
  let sum = 0;
    
  for (let i = 0; i < iterations; i += 1) {
    let now = Date.now();
    await axios.get(`http://localhost:${port}/restaurants/${get1To10M()}/profile`);
    let later = Date.now();
    sum += later - now;
  }
  console.log(`${dbName} ${iterations} READs avg: `, sum / iterations, 'ms');
};

// // Log READ averages for both dbs and log the results
// getReadAverage('PostgreSQL', 3001);
// getReadAverage('Cassandra', 4000);


// Logs a Post (insertion) average time for sample restaurants.
const getPostAverage = async (dbName, port) => {
  let sum = 0;
    
  for (let i = 0; i < iterations; i += 1) {
    let now = Date.now();
    await axios.post(`http://localhost:${port}/restaurants/`, {
      accuracy: 000,
      address: 'POST TEST ADDRESS',
      delivery: 000,
      name: 'POST TEST NAME',
      number: 'POST TEST NUMBER 555-555',
      picture: 'http://TEST.TEST.TEST',
      quality: 000,
      stars: 000,
    });
    let later = Date.now();
    sum += later - now;
  }

  console.log(`${dbName} ${iterations} POSTs avg: `, sum / iterations, 'ms');
};

// // Log POST averages for both dbs and log the results
// getPostAverage('PostgreSQL', 3001);
// getPostAverage('Cassandra', 4000);


// Logs a Put (update) average time.
const getPutAverage = async (dbName, port) => {
  let sum = 0;
  // So that the random restaurant ids can be logged later on.
  let rands = [];

  for (let i = 0; i < iterations; i += 1) {
    let rand = get1To10M();
    rands.push(rand);

    let now = Date.now();
    await axios.put(`http://localhost:${port}/restaurants/${rand}`, {
      address: 'PUT TEST ADDRESS',
      number: 'PUT TEST NUMBER 555-555',
      quality: 000,
      stars: 000,
    });

    let later = Date.now();
    sum += later - now;
  }

  console.log('Random restaurants changed: ', rands);
  console.log(`${dbName} ${iterations} PUTs avg: `, sum / iterations, 'ms');
};

// // Get PUT averages for both dbs and log the results
// getPutAverage('PostgreSQL', 3001);
// getPutAverage('Cassandra', 4000);


// Logs a Delete (update) average time.
const getDeleteAverage = async (dbName, port) => {
  let sum = 0;
  // So that the random restaurant ids can be logged later on.
  let rands = [];

  for (let i = 0; i < iterations; i += 1) {
    let rand = get1To10M();
    rands.push(rand);

    let now = Date.now();
    await axios.delete(`http://localhost:${port}/restaurants/${rand}`);
    let later = Date.now();
    sum += later - now;
  }

  console.log('Random restaurants deleted: ', rands);
  console.log(`${dbName} ${iterations} DELETEs avg: `, sum / iterations, 'ms');
};

// // Get Delete averages for both dbs and log the results
// getDeleteAverage('PostgreSQL', 3001);
// getDeleteAverage('Cassandra', 4000);
