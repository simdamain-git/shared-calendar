const express = require('express');
const router = express.Router();
const Group = require('../models/Group')
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/groups', auth, async (req, res) => {
  try {
    console.log(req, res);
    const groups = await Group.find({ members: req.userData.userId })
    .populate('members', 'username')
    .sort({ createdAt: -1 });
    res.json({ error: null, groups });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des groupes' });
  }
});

router.put('/groups/:id', auth, async (req, res) => {
  try {
    const group = await Group.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userData.userId },
      { 
        name: req.body.name,
        members: req.body.members
      },
      { new: true, runValidators: true }
    );

    if (!group) {
      return res.status(404).send('Group not found or you are not authorized to update it');
    }

    res.send(group);
  } catch (error) {
    res.status(400).send(error);
  }
});



router.post('/groups', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Le nom du groupe est requis' });
    }
    const newGroup = new Group({
      name,
      members: [req.userData.userId],
      createdBy: req.userData.userId,
      createdAt: Date.now()
    });

    await newGroup.save();

    res.status(201).json({ error: null, group: newGroup });
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error);
    res.status(500).json({ error: 'Erreur lors de la création du groupe' });
  }
});

router.delete('/groups/:id', auth, async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!group) return res.status(404).send('Group not found or you are not the creator');
    res.send(group);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/groups/:idGroup/members', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.idGroup);
    if (!group) {
      return res.status(404).json({ error: 'Groupe non trouvé' });
    }

    if (!group.members.includes(req.userData.userId) && group.createdBy.toString() !== req.userData.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const members = await User.find(
      { _id: { $in: group.members } },
      'id username'
    );

    res.json(members.map(member => ({
      id: member._id.toString(),
      username: member.username
    })));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des membres du groupe' });
  }
});

router.post('/groups/:id/members', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Groupe non trouvé' });
    
    if (group.createdBy.toString() !== req.userData.userId) {
      return res.status(403).json({ error: 'Seul le créateur du groupe peut ajouter des membres' });
    }
    
    const userToAdd = await User.findOne({ username: req.body.email });
    if (!userToAdd) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    
    if (group.members.includes(userToAdd._id)) {
      return res.status(400).json({ error: 'L\'utilisateur est déjà membre de ce groupe' });
    }
    
    group.members.push(userToAdd._id);
    await group.save();
  
    res.json({ message: 'Membre ajouté avec succès', group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du membre' });
  }
});

router.delete('/groups/:id/members/:userId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).send('Group not found');
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send('Only the group creator can remove members');
    }
    group.members = group.members.filter(member => member.toString() !== req.params.userId);
    await group.save();
    res.send(group);
  } catch (error) {
    res.status(400).send(error);
  }
});





module.exports = router;
