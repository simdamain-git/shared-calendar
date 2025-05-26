// test-mongoose-user.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const email = 'simdamain@gmail.com';
const password = 'azer1234';

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connexion Mongoose réussie');

        const user = await User.findOne({ email });
        if (!user) {
            console.error('❌ Aucun utilisateur trouvé avec cet email');
            process.exit(1);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log('🔐 Mot de passe valide pour', email);
            console.log('👤 Utilisateur :', user);
        } else {
            console.error('❌ Mot de passe invalide');
            process.exit(1);
        }

        process.exit(0);
    } catch (err) {
        console.error('🚨 Erreur dans le test Mongoose :', err);
        process.exit(1);
    }
})();