const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/cassandra/index');
const app = express();
const PORT = 4000;
const morgan = require('morgan');
const path = require('path');
const { parseNums } = require('./helpers');

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static((__dirname + '/../client/dist')));

// GET request to a specific ID to responds with the HTML file
app.get('/restaurants/:id', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

// GET request responds with info about a restaurant with specific id 
app.get('/restaurants/:id/profile', (req, res) => {
  db.getFromDb({ id: Number(req.params.id) })
    .then(restaurantResult => res.json(restaurantResult))
    .catch(() => res.status(500));
});

// POSTs new restaurant with unique id
app.post('/restaurants/', (req, res) => {
  parseNums(req.body);

  db.postToDb(req.body)
    .then(restaurantResult => res.json(restaurantResult));
});

// PUT (update) request updates info about restaurant with specific id
app.put('/restaurants/:id', (req, res) => {
  parseNums(req.body);

  let updates = {
    selectors: {
      id: Number(req.params.id),
    },
    updateChanges: req.body,
  };

  db.updateInDb(updates)
    .then(restaurantResult => res.json(restaurantResult));
});


// DELETE request deletes restaurant with specific id
app.delete('/restaurants/:id', (req, res) => {
  parseNums(req.params);

  let deleteRest = {
    selectors: req.params,
  };

  db.deleteFromDb(deleteRest)
    .then(restaurantResult => res.json(restaurantResult));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
