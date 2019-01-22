const updateRestaurant = (restaurant, updates) => {
  for (let key in updates) {
    restaurant[key] = updates[key];
  }
};

module.exports = {
  updateRestaurant,
};
