const faker = require('faker');

const getName = () => faker.company.companyName();
const get0To5 = () => Math.floor(Math.random() * 6);
const get0To100 = () => Math.floor(Math.random() * 101);
const getPicture = () => faker.image.food();
const getPhone = () => faker.phone.phoneNumber();
const getAddress = () => faker.address.streetAddress();

// Depending on if an 'id' header is wanted in the headers and restaurant object generation,
// uncomment (comment) out lines 12 (13) and 22 (23). 

// const createRestaurant = (id) => ({
const createRestaurant = () => ({
  name: getName(),
  address: getAddress(),
  number: getPhone(),
  picture: getPicture(),
  stars: get0To5(),
  quality: get0To100(),
  delivery: get0To100(),
  accuracy: get0To100(),
});

// const header =  ['id', 'name', 'address', 'number', 'picture', 'stars', 'quality', 'delivery', 'accuracy',];
const header =  ['name', 'address', 'number', 'picture', 'stars', 'quality', 'delivery', 'accuracy',];

module.exports = {
  createRestaurant,
  header,
};
