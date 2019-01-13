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
  return `SELECT * FROM restaurants WHERE ${keyValuePairStr};`;
};


module.exports = {
  selectQueryString,
};
