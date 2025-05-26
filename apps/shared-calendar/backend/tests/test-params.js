// tests/test-signin.js
require('dotenv').config();
const mongoose = require('mongoose');
const request  = require('supertest');
const app      = require('../app');   // n'importe où ton app.js

(async () => {
    try {
        // 1) On connecte Mongoose AVANT tout
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Mongoose connecté pour le test');

        // 2) On envoie la requête POST /signin
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'simdamain@gmail.com', password: 'azer1234' })
            .set('Content-Type', 'application/json');

        console.log('✅ Statut :', res.statusCode);
        console.log('🟢 Réponse :', res.body);

        process.exit(res.statusCode === 200 && res.body.token ? 0 : 1);
    } catch (err) {
        console.error('❌ Erreur pendant le test signin :', err);
        process.exit(1);
    }
})();
