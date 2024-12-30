const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const groupsRoutes = require('./routes/groups');
const eventsRoutes = require('./routes/events');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' }));

// connexion mongodb
mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api', notesRoutes);
app.use('/api', groupsRoutes);
app.use('/api', eventsRoutes);


module.exports = app;