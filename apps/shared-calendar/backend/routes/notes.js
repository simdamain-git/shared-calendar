const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userData.userId }).sort({ createdAt: -1 });
    res.json({ error: null, notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
});

router.get('/notes/:id', auth, async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findOne({ _id: noteId, userId: req.userData.userId });
    
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    res.json({ error: null, note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la note' });
  }
});

router.post('/notes', auth, async (req, res) => {
  try {
    const { content, title, groupId } = req.body;
    const newNote = new Note({
      content,
      title,
      userId: req.userData.userId,
      groupId: groupId || null,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now()
    });

    await newNote.save();
    res.status(201).json({ error: null, note: newNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la note' });
  }
});

router.put('/notes/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title, groupId } = req.body;
    
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.userData.userId },
      { 
        content, 
        title,
        groupId: groupId || null,
        lastUpdatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );    

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note non trouvée ou non autorisée' });
    }

    res.json({ error: null, note: updatedNote });
  } catch (error) {
    console.error(error);
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