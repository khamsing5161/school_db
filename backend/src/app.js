const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://singkham.netlify.app"
  ]
}));

app.use(express.json());

// Routes
app.use('/students',  require('./routes/students'));
// app.use('/lecturers', require('./routes/lecturers'));

module.exports = app;