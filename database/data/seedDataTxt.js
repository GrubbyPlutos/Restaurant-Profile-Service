const fs = require('fs');
const { createRestaurant } = require('./helpers');

const file = fs.createWriteStream('data.txt');
let i = 0;
const entries = 1e7;

const creatDataTxtFile = () => {
  let result = true;

  while (i < entries && result) {
    result = file.write(JSON.stringify(createRestaurant(i)) + '\n');
    i += 1;
    if (i % 1000000 === 0) {
      console.log(i);
    }
  }


  if (i < entries) {
    file.once('drain', creatDataTxtFile);
  } else if (i === entries) {
    file.end();
  }
};

creatDataTxtFile();
