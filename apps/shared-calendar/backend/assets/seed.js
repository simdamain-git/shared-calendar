const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User'); // Assurez-vous que le chemin est correct
const Note = require('../models/Note'); // Assurez-vous que le chemin est correct

// Remplacez par l'URI de votre base de données
const MONGODB_URI = 'mongodb://localhost:27017/notes-api';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    // Créer un utilisateur
    const username = 'testuser';
    const password = 'testpassword'; // Utilisez un mot de passe sécurisé en production
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username: username, password: hashedPassword });
    await user.save();
    console.log('Utilisateur créé:', user);

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