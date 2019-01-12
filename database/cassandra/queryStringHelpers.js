/* 
 * This file contains query string helpers for querying the database, including:
 *  - selecting, inserting, updating and removing from the db.
 */

// Returns key=value string joined by 'AND's for querying the database.
// 
// An example of a returned string: 
//  --> id=4 AND name='Hard Rock Cafe' AND address='344 E 47th St'
//
// If typeof value is a string, then add single quotes (i.e. ') before and after
const keyValPairStr = (keys, values, separator) => {
  let strBuilder = [];
  for (let i = 0; i < keys.length; i += 1) {
    let key = keys[i];
    let value = values[i];
    value = typeof value === 'string' ? '\'' + value + '\'' : value;
    strBuilder.push(key + '=' + value);
    strBuilder.push(separator);
  }
  strBuilder.pop();
  return strBuilder.join(' ');
};


// Returns a query string to select from the restaurant table given conditions
const selectQueryString = conditions => {
  let keys = Object.keys(conditions);
  let values = keys.map(key => conditions[key]);
  let keyValuePairStr = keyValPairStr(keys, values, 'AND');
  // Filtering is allowed for now as MVP for making the API CRUDdy
  return `SELECT * FROM restaurant WHERE ${keyValuePairStr} ALLOW FILTERING;`;
};


// Returns query string to find the next id in the nextIdTable.
const nextIdQueryString = () => `SELECT nextId FROM nextIdTable WHERE name='next' ALLOW FILTERING;`;
// Inserts a restaurant record into the restaurant table.
const insertQueryString = rest => `INSERT INTO restaurant (id, name, address, number, picture, stars, quality, delivery, accuracy) VALUES(${rest.id}, '${rest.name}', '${rest.address}', '${rest.number}', '${rest.picture}', ${rest.stars}, ${rest.quality}, ${rest.delivery}, ${rest.accuracy});`;
// Updates the nextIdTable to contain the new next id for the next restaurant.
const updateNextId = newId => `UPDATE nextIdTable SET nextid=${newId} WHERE name='next';`;


// Returns update query string to query 
const updateQueryString = (selectors, updateChanges) => {
  let selectorKeys = Object.keys(selectors);
  let selectorValues = selectorKeys.map(key => selectors[key]);
  let selectorStr = keyValPairStr(selectorKeys, selectorValues, 'AND');

  let updateKeys = Object.keys(updateChanges);
  let updateValues = updateKeys.map(key => updateChanges[key]);
  let updatesStr = keyValPairStr(updateKeys, updateValues, ',');

  return `UPDATE restaurant SET ${updatesStr} WHERE ${selectorStr};`;
};


// Returns the query string for deleting a restaurant that matches the selectors
const deleteQueryString = (selectors) => {
  let selectorKeys = Object.keys(selectors);
  let selectorValues = selectorKeys.map(key => selectors[key]);
  let selectorStr = keyValPairStr(selectorKeys, selectorValues, 'AND');

  return `DELETE FROM restaurant WHERE ${selectorStr};`
};

module.exports = {
  selectQueryString,
  insertQueryString,
  nextIdQueryString,
  updateNextId,
  updateQueryString,
  deleteQueryString,
};
