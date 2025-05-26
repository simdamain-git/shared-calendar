// test-mongo-conn.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

(async () => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('✅ Connexion MongoDB réussie');
        const databasesList = await client.db().admin().listDatabases();
        console.log("📂 Bases disponibles :", databasesList.databases.map(db => db.name));
        process.exit(0);
    } catch (err) {
        console.error('❌ Erreur de connexion MongoDB :', err);
        process.exit(1);
    } finally {
        await client.close();
    }
})();