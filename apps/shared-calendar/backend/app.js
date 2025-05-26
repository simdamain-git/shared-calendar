// app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes   = require('./routes/auth');
const notesRoutes  = require('./routes/notes');
const groupsRoutes = require('./routes/groups');
const eventsRoutes = require('./routes/events');
const cors = require('cors');
const app= express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// --- Connexion Mongoose ---
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Mongoose connecté'))
    .catch(err => {
        console.error('❌ Mongoose erreur de connexion :', err);
        process.exit(1);
    });

// Routes
app.use('/api/auth',   authRoutes);
app.use('/api/notes',  notesRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/events', eventsRoutes);


// 404 handler
app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).json({ error: 'Route not found' });
});

// Error handling for JSON parsing (doit être après les routes !)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON Parse Error:', err);
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    next(err);
});

module.exports = app;
