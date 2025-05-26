require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

(async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME,
        });

        console.log('✅ Connecté à MongoDB');

        // ⚠️ Remplace par un _id existant de user pour tester
        const testUserId = '67c8ad3875d96c3e4c5d08ed'; // exemple d'ObjectId existant
        const testGroupId = null; // facultatif, peut être null ou autre ID

        const eventData = {
            title: 'Test Event',
            description: 'Ceci est un événement de test',
            start: new Date(),
            end: new Date(Date.now() + 60 * 60 * 1000), // 1h après
            groupId: testGroupId,
            visibility: 'group',
            type: 'event',
            repetition: 'once',
            userId: testUserId,
        };

        const newEvent = new Event(eventData);
        const savedEvent = await newEvent.save();

        console.log('🎉 Événement créé avec succès :', savedEvent);
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la création de l’événement :', error);
        process.exit(1);
    }
})();
