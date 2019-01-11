const fs = require('fs');
const { createRestaurant, header } = require('./helpers');

const file = fs.createWriteStream('data.csv');

// Write the header once
for (let i = 0; i < header.length; i += 1) {
  if (i === header.length - 1) {
    file.write(header[i] + '\n');
  } else {
    file.write(header[i] + ',');
  }
}

// Create a string with comma-separated values and ending with a newline
// These values are the restaurant values for each restaurant object key
const getRestaurantString = restaurant => {
  // Using a StringBuilder instead of a string concatenator
  let stringBuilder = [];
  for (let i = 0; i < header.length; i += 1) {
    stringBuilder.push(JSON.stringify(restaurant[header[i]]));
  }
  return stringBuilder.join(',') + '\n';
};

// Starting i = 0
// Total number of entries = 10 million
let i = 0;
const entries = 1e7;

const createDataCsvFile = () => {
  let result = true;

  while (i < entries && result) {
    let restaurant = createRestaurant(i);
    result = file.write(getRestaurantString(restaurant));
    i += 1;
    if (i % 1000000 === 0) {
      console.log(i);
    }
  }

  if (i < entries) {
    file.once('drain', createDataCsvFile);
  } else if (i === entries) {
    file.end();
  }
};

createDataCsvFile();
