const express  = require('express');
const cors     = require('cors');
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://singkham.netlify.app/"
  ]
}));

app.use(express.json()); // รับ JSON จาก request body

// Routes
app.use('/students',  require('./routes/students'));
// app.use('/lecturers', require('./routes/lecturers'));

module.exports = app;