const express  = require('express');
const cors     = require('cors');
const app      = express();
app.use(cors({
  origin: 'http://localhost:5173'   // ← ชี้ตรงไปที่ React
}));

app.use(express.json()); // รับ JSON จาก request body

// Routes
app.use('/students',  require('./routes/students'));
// app.use('/lecturers', require('./routes/lecturers'));

module.exports = app;