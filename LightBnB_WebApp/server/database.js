const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool.query(`
    SELECT users.*
    FROM users
    WHERE users.email = $1
  `, [email])
  .then(res => {
    // console.log(res.rows)
    return res.rows[0];
  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  return pool.query(`
  SELECT users.*
  FROM users
  WHERE users.id = '${id}'
`)
.then(res => {
  // console.log(res.rows)
  return res.rows[0];
})
  // return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // console.log(user)
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `, [user.name, user.email, user.password])
  .then(res => {
    // console.log(res.rows)
    return Promise.resolve(res.rows[0])
  })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  return pool.query(`
  SELECT reservations.id, reservations.start_date, reservations.end_date, reservations.property_id, reservations.guest_id, properties.id, properties.title, properties.owner_id, properties.description, properties.thumbnail_photo_url, properties.cover_photo_url, properties.cost_per_night, properties.parking_spaces, properties.number_of_bathrooms, properties.number_of_bedrooms, properties.country, properties.street, properties.city, properties.province, properties.post_code, properties.active, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN reservations ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1 
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guest_id, limit])
  .then(res => {
    // console.log(res.rows)
    return res.rows
  })
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  console.log(options)
  const queryParams = [];
  // 2
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

  // 3 FIRST 
  if (options.city) {
    console.log("BLAAAAAH")
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `; 
  }

  if(options.owner_id) {
    if(queryParams.length > 0) {
      console.log("HEEEEREEEE")
      queryParams.push(options.owner_id)
      queryString += `AND owner_id = $${queryParams.length}`
    } else {
      queryParams.push(options.owner_id)
      queryString += `WHERE owner_id = $${queryParams.length}`
    }
  }

  if(options.minimum_price_per_night) {
    if (queryParams.length > 0) {
      queryParams.push(options.minimum_price_per_night)
      queryString += `AND properties.cost_per_night >= $${queryParams.length}`
    } else {
      queryParams.push(options.minimum_price_per_night)
      queryString += `WHERE properties.cost_per_night >= $${queryParams.length}`
    } 
  }

  if(options.maximum_price_per_night) {
    if (queryParams.length > 0) {
      queryParams.push(options.maximum_price_per_night)
      queryString += `AND properties.cost_per_night <= $${queryParams.length}`
    } else {
      queryParams.push(options.maximum_price_per_night)
      queryString += `WHERE properties.cost_per_night <= $${queryParams.length}`
    }
  }


  queryString += `
    GROUP BY properties.id
  `
  if(options.minimum_rating) {
    console.log(options.minimum_rating)
    queryParams.push(options.minimum_rating)
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`
  }

  // 4
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
  
  
  // return pool.query(`
  // SELECT properties.*, AVG(property_reviews.rating) as average_rating
  // FROM properties
  // JOIN property_reviews ON properties.id = property_reviews.property_id
  // GROUP BY properties.id
  // LIMIT $1;
  // `, [limit])
  // .then(res => {
  //   console.log(res.rows)
  //   return Promise.resolve(res.rows)
  // });
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;