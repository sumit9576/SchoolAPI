const db = require('../config/db');
const haversine = require('haversine-distance');

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Invalid input. All fields are required.' });
  }

  const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
  });
};

exports.listSchools = (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: 'Please provide valid latitude and longitude' });
  }

  db.query('SELECT * FROM schools', (err, schools) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });

    const userLocation = { lat: userLat, lon: userLon };
    const result = schools.map((school) => {
      const schoolLocation = { lat: school.latitude, lon: school.longitude };
      const distance = haversine(userLocation, schoolLocation) / 1000; // meters to km
      return { ...school, distance };
    });

    result.sort((a, b) => a.distance - b.distance);  
    res.json(result);
  });
};
