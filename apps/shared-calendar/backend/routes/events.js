// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

router.get('/events', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.userData.userId }).sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    console.error('Erreur dans /events:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
  }
});

router.get('/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.userData.userId });
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    res.json(event);
  } catch (error) {
    console.error('Erreur dans /events/:id:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement' });
  }
});

router.post('/events', auth, async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      userId: req.userData.userId
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'événement' });
  }
});

router.put('/events/:id', auth, async (req, res) => {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.userData.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
  }
});

router.delete('/events/:id', auth, async (req, res) => {
  try {
    const deletedEvent = await Event.findOneAndDelete({ _id: req.params.id, userId: req.userData.userId });
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
  }
});

module.exports = router;
