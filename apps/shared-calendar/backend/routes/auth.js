const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

function generateTokens(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
  return { token, refreshToken };
}

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
    
    if (password.length < 4 || !email) {
      return res.status(400).json({ error: errorMessage });
    }
    
    const user = await User.findOne({ email });    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ error: errorMessage });
    }
    
    const { token, refreshToken } = generateTokens(user._id);
    res.json({
      token,
      refreshToken,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.log('test', error);
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

module.exports = router;
