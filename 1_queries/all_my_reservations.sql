SELECT reservations.id, reservations.start_date, reservations.end_date, reservations.property_id, reservations.guest_id, properties.id, properties.title, properties.owner_id, properties.description, properties.thumbnail_photo_url, properties.cover_photo_url, properties.cost_per_night, properties.parking_spaces, properties.number_of_bathrooms, properties.number_of_bedrooms, properties.country, properties.street, properties.city, properties.province, properties.post_code, properties.active, AVG(property_reviews.rating) as average_rating
FROM properties
JOIN reservations ON reservations.property_id = properties.id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1 
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;