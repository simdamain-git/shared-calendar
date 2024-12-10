const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({ error: 'Utilisateur non connecté' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY); 
    req.userData = decoded; 
    next();
  } catch (error) {
    console.log('Erreur de vérification du token:', error);
    return res.status(401).json({ error: 'Utilisateur non connecté' });
  }
};