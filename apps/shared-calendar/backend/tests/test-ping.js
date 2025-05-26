require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME,
        });

        // Vérification de l'état de la connexion
        const state = mongoose.connection.readyState;

        const states = {
            0: '🔴 Déconnecté',
            1: '🟢 Connecté',
            2: '🟡 Connexion en cours',
            3: '🔵 Déconnexion en cours'
        };

        console.log('✅ État de la connexion MongoDB :', states[state]);

        // Si connecté, lister les bases disponibles
        if (state === 1) {
            const admin = mongoose.connection.db.admin();
            const { databases } = await admin.listDatabases();
            console.log('📂 Bases disponibles :', databases.map(db => db.name));
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Erreur lors du ping MongoDB :', err);
        process.exit(1);
    }
})();
