const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/cassandra/index');
// const db = require('../database/postgresql/index');
const app = express();
const PORT = 3001;
const morgan = require('morgan');
const path = require('path');
const { parseNums } = require('./helpers');

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static((__dirname + '/../client/dist')));

app.get('/restaurants/:id', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

app.get('/restaurants/:id/profile', (req, res) => {
  db.getFromDb({ id: Number(req.params.id) })
    .then(restaurantResult => res.json(restaurantResult))
    .catch(() => res.status(500));
});

app.post('/restaurants/', (req, res) => {
  parseNums(req.body);

  db.postToDb(req.body)
    .then(restaurantResult => res.json(restaurantResult));
});

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
