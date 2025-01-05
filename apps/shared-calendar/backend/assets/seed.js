const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User'); // Assurez-vous que le chemin est correct
const Note = require('../models/Note'); // Assurez-vous que le chemin est correct

// Remplacez par l'URI de votre base de données
const MONGODB_URI = 'mongodb://localhost:27017/notes-api';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    // Créer des notes pour cet utilisateur
    const notes = [
      { userId: user._id, content: 'Première note', createdAt: new Date(), lastUpdatedAt: null },
      { userId: user._id, content: 'Deuxième note', createdAt: new Date(), lastUpdatedAt: null },
      { userId: user._id, content: 'Troisième note', createdAt: new Date(), lastUpdatedAt: null }
    ];

    await Note.insertMany(notes);
    console.log('Notes créées:', notes);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Erreur lors de la connexion à MongoDB:', err);
  });