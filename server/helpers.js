const parseNums = obj => {
  Object.keys(obj).forEach(key => {
    if (!!Number(obj[key]) || Number(obj[key]) === 0) {
      obj[key] = Number(obj[key]);
    }
  });
};

module.exports = {
  parseNums,
};
