require('newrelic');
const express = require('express');
const cache = require('../database/redis-cache/index-redis');
const bodyParser = require('body-parser');
const path = require('path');
const { parseNums } = require('./helpers');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static((__dirname + '/../client/dist')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/app.js', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/../client/dist/bundle.js'));
});

// GET request to a specific ID to responds with the HTML file
app.get('/restaurants/:id', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

// GET request responds with info about a restaurant with specific id 
app.get('/restaurants/:id/profile', (req, res) => {
  let id = Number(req.params.id);
  cache.getWrapper(id, res);
});

// POSTs new restaurant with unique id
app.post('/restaurants/', (req, res) => {
  parseNums(req.body);
  cache.postWrapper(req.body, res);
});

// PUT (update) request updates info about restaurant with specific id
app.put('/restaurants/:id', (req, res) => {
  parseNums(req.body);

  let updates = {
    selectors: { id: Number(req.params.id), },
    updateChanges: req.body,
  };

  cache.putWrapper(updates, res);
});


// DELETE request deletes restaurant with specific id
app.delete('/restaurants/:id', (req, res) => {
  parseNums(req.params);

  let deleteRest = {
    selectors: req.params,
  };

  cache.deleteWrapper(deleteRest, res);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
