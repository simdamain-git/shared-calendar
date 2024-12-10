const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/notes', auth, async (req, res) => {
  try {
    console.log(req, res);
    const notes = await Note.find({ userId: req.userData.userId }).sort({ createdAt: -1 });
    res.json({ error: null, notes });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
});

router.put('/notes', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const note = new Note({
      userId: req.userData.userId,
      content
    });
    await note.save();
    res.json({ error: null, note });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la note' });
  }
});

router.patch('/notes/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const note = await Note.findOne({ _id: id, userId: req.userData.userId });

    if (!note) {
      return res.status(404).json({ error: 'Cet identifiant est inconnu' });
    }

    note.content = content;
    note.lastUpdatedAt = Date.now();
    await note.save();

    res.json({ error: null, note });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la note' });
  }
});

router.delete('/notes/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, userId: req.userData.userId });

    if (!note) {
      return res.status(404).json({ error: 'Cet identifiant est inconnu' });
    }

    await note.remove();
    res.json({ error: null });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la note' });
  }
});

module.exports = router;