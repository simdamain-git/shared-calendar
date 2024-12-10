const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

async function hashExistingPasswords() {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {});
  const db = client.db('notes-api');
  const collection = db.collection('users');
  const users = await collection.find({ password: { $exists: true, $not: /^\$2[ayb]\$/ } }).toArray();

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await collection.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
  }

  console.log(`${users.length} mots de passe ont été hashés.`);
  client.close();
}

hashExistingPasswords();