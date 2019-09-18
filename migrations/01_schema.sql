CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255) NOT NULL
)

CREATE TABLE rates (
  id SERIAL PRIMARY KEY NOT NULL,
  start_date DATE,
  end_date DATE,
  cost_per_night INTEGER,
  property_id INTEGER
)

CREATE TABLE properties (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER,
  title VARCHAR(255),
  description VARCHAR(255),
  thumbnail_photo_url NVARCHAR(1000),
  cover_photo_url NVARCHAR(1000),
  cost_per_night INTEGER,
  street VARCHAR(255),
  parking_spaces INTEGER,
  number_of_bathrooms INTEGER,
  number_of_bedrooms INTEGER,
  country VARCHAR(255),
  city VARCHAR(255),
  province VARCHAR(255),
  post_code VARCHAR(255),
  active BOOLEAN NOT NULL
)

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY NOT NULL,
  start_date DATE,
  end_date DATE,
  property_id INTEGER,
  guest_id INTEGER
)

CREATE TABLE property_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  guest_id INTEGER,
  reservation_id INTEGER,
  property_id INTEGER,
  rating INTEGER,
  message VARCHAR(255)
)

CREATE TABLE guest_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  guest_id INTEGER,
  owner_id INTEGER,
  reservation_id INTEGER,
  rating INTEGER,
  message VARCHAR(255)
)