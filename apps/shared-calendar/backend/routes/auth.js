const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

function generateTokens(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
  return { token, refreshToken };
}

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (password.length < 4) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 4 caractères' });
    }

    if (!/^[a-z]{2,20}$/.test(username)) {
      return res.status(400).json({ error: 'Votre identifiant doit contenir entre 2 et 20 caractères minuscules non accentués' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet identifiant est déjà associé à un compte' });
    }

    const user = new User({ username, password });
    await user.save();

    const { token, refreshToken } = generateTokens(user._id);
    res.json({
      token,
      refreshToken,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const errorMessage = 'Erreur lors de la connexion';
    const { username, password } = req.body;
    if (password.length < 4 || !/^[a-z]{2,20}$/.test(username)) {
      return res.status(400).json({ error: errorMessage });
    }
    const user = await User.findOne({ username });    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ error: errorMessage });
    }
    const { token, refreshToken } = generateTokens(user._id);
    res.json({
      token,
      refreshToken,
      user: { id: user._id, username: user.username }
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
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    res.status(401).json({ error: 'Refresh token invalide ou expiré' });
  }
});

module.exports = router;