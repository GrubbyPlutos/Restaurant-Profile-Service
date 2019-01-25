const { Pool } = require('pg');
const { selectQueryString,
  insertQueryString,
  updateQueryString,
  deleteQueryString } = require('./queryStringHelpers');

const pool = new Pool({
  user: 'postgres',
  host: '54.67.60.124',
  database: 'profile_service',
  password: 'student',
  port: 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Returns a promise that resolves in the selection query results
const getFromDb = conditions => (
  pool.connect()
    .then(client => (
      client.query(selectQueryString(conditions))
        .then(selectResults => {
          console.log('SUCCESS IN THE POOL/CONNECT STUFF');
          client.release();
          return selectResults.rows;
        })
        .catch(() => {
          client.release();
          console.log('ERROR GETTING RESTAURANT GIVEN CONDITIONS.');
        })
    ))
);


// const getReservationsById = (id, cb) => {
//   pool.connect()
//     .then((client) => {
//       return client.query(`SELECT * FROM rooms, reservations WHERE rooms.roomid=reservations.roomid AND rooms.roomid=${id}`)
//         .then((res) => {
//           client.release();
//           cb(null, res.rows[0]);
//         })
//         .catch((err) => {
//           client.release();
//           cb(err.stack);
//         });
//     });
// };


// Posts (inserts) a new restaurant into the db with a unique restaurant Id.
const postToDb = rest => (
  pool.connect()
    .then(client => (
      client.query(insertQueryString(rest))
        .then(insertResults => {
          client.release();
          return insertResults;
        })
        .catch(() => {
          client.release();
          console.log('ERROR INSERTING RESTAURANT.');
        })
    ))
);

// const modifyAvailabilityById = (id, options, cb) => {  
//   pool.connect()
//     .then((client) => {
//       return client.query(`INSERT INTO reservations VALUES (${id},'${options.rezName}','${options.checkIn}','${options.checkOut}',${options.adults},${options.children},${options.infants})`)
//         .then((res) => {
//           client.release();
//           cb(null, res.rows[0]);
//         })
//         .catch((err) => {
//           client.release();
//           cb(err.stack);
//         });
//     });
// };


// Updates restaurant records that match specific 'selectors' to whatever 'updateChanges' keys indicate.
const updateInDb = ({ selectors, updateChanges }) => (
  pool.connect()
    .then(client => (
      client.query(updateQueryString(selectors, updateChanges))
        .then(updateResults => {
          client.release();
          return updateResults;
        })
        .catch(() => {
          client.release();
          console.log('ERROR UPDATING RESTAURANT.');
        })
    ))
);


// const createNewRez = (id, options, cb) => {
//   pool.connect()
//     .then((client) => {
//       return client.query(`INSERT INTO reservations VALUES (${id},'${options.rezName}','${options.checkIn}','${options.checkOut}',${options.adults},${options.children},${options.infants})`)
//         .then((res) => {
//           client.release();
//           cb(null, res.rows[0]);
//         })
//         .catch((err) => {
//           client.release();
//           cb(err.stack);
//         });
//     });
// };

// Deletes a restaurant with a given id
const deleteFromDb = ({ selectors }) => (
  pool.connect()
    .then(client => (
      client.query(deleteQueryString(selectors))
        .then(deleteResults => {
          client.release();
          return deleteResults;
        })
        .catch(() => {
          client.release();
          console.log('ERROR IN DELETING RESTAURANT.')
        })
    ))
);

// const deleteRezByName = (id, rezName, cb) => {
//   pool.connect()
//     .then((client) => {
//       return client.query(`DELETE FROM reservations WHERE roomid=${id} AND rezname='${rezName}'`)
//         .then((res) => {
//           client.release();
//           cb(null, res.rows[0]);
//         })
//         .catch((err) => {
//           client.release();
//           cb(err.stack);
//         });
//     });
// };

module.exports = {
  getFromDb,
  postToDb,
  updateInDb,
  deleteFromDb,
};
