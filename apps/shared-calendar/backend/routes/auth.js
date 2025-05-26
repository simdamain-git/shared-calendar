const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();


const router = express.Router();
console.log('Chargement de auth.js');
function generateTokens(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
  return { token, refreshToken };
}

// Configuration du service d'email (utilise un service réel comme SendGrid ou Mailtrap en production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (password.length < 4) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 4 caractères' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Veuillez fournir une adresse email valide' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Cette adresse email est déjà associée à un compte' });
    }

    const user = new User({ email, password });
    await user.save();

    const { token, refreshToken } = generateTokens(user._id);
    
    res.json({
      token,
      refreshToken,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const errorMessage = 'Erreur lors de la connexion';
    const { email, password } = req.body;

    if (!email || password.length < 4) {
      return res.status(400).json({ error: errorMessage });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      return res.status(403).json({ error: errorMessage });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid password');
      return res.status(403).json({ error: errorMessage });
    }

    const { token, refreshToken } = generateTokens(user._id);
    res.json({
      token,
      refreshToken,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token manquant' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const { token: newToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(401).json({ error: 'Refresh token invalide ou expiré' });
  }
});


// Route: Demande de réinitialisation de mot de passe
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Génération d'un token unique (valable 1 heure)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h

    await user.save();

    // Envoi de l'email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">${resetLink}</a>`,
    });
    res.json({ message: 'Un email de réinitialisation a été envoyé' });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route: Réinitialisation du mot de passe
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (!user.resetPasswordToken || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      return res.status(400).json({ error: 'Token invalide' });
    }

    // Mise à jour du mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ping route to check database connection
router.get('/ping', async (req, res) => {
  console.log('/ping');
  try {
    // Perform a simple database operation to check the connection
    await mongoose.connection.db.admin().ping();
    console.log('Database connection is healthy');
    res.status(200).json({ message: 'Database connection is healthy' });
  } catch (error) {
    console.error('Database ping failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

module.exports = router;
