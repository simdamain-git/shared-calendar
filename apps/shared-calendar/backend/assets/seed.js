const mongoose = require('mongoose');
const Note = require('../models/Note');
const Event = require('../models/Event');

const notes = [
  {
    userId: "674f6e0f2b430fa1cb5c011a",
    content: "This is a private note for user 1.",
    title: "Private Note 1",
    groupId: null,
    visibility: "private",
    createdAt: new Date("2023-10-01T10:00:00Z"),
    lastUpdatedAt: new Date("2023-10-01T10:00:00Z")
  },
  {
    userId: "677ae0bb7084870961878893",
    content: "This is a group note for group 1.",
    title: "Group Note 1",
    groupId: "676f03e101fdc6c25e7a0bd8",
    visibility: "group",
    createdAt: new Date("2023-10-02T11:00:00Z"),
    lastUpdatedAt: new Date("2023-10-02T11:00:00Z")
  },
  {
    userId: "674f6e0f2b430fa1cb5c011a",
    content: "This is another private note for user 1.",
    title: "Private Note 2",
    groupId: null,
    visibility: "private",
    createdAt: new Date("2023-10-03T12:00:00Z"),
    lastUpdatedAt: new Date("2023-10-03T12:00:00Z")
  },
  {
    userId: "677ae0bb7084870961878893",
    content: "This is another group note for group 1.",
    title: "Group Note 2",
    groupId: "676f03e101fdc6c25e7a0bd8",
    visibility: "group",
    createdAt: new Date("2023-10-04T13:00:00Z"),
    lastUpdatedAt: new Date("2023-10-04T13:00:00Z")
  }
];

const events = [
  {
    title: "Private Event 1",
    description: "This is a private event for user 1.",
    start: new Date("2023-10-05T14:00:00Z"),
    end: new Date("2023-10-05T15:00:00Z"),
    groupId: null,
    visibility: "private",
    type: "event",
    repetition: "once",
    userId: "674f6e0f2b430fa1cb5c011a"
  },
  {
    title: "Group Event 1",
    description: "This is a group event for group 1.",
    start: new Date("2023-10-06T16:00:00Z"),
    end: new Date("2023-10-06T17:00:00Z"),
    groupId: "676f03e101fdc6c25e7a0bd8",
    visibility: "group",
    type: "event",
    repetition: "once",
    userId: "677ae0bb7084870961878893"
  },
  {
    title: "Private Event 2",
    description: "This is another private event for user 1.",
    start: new Date("2023-10-07T18:00:00Z"),
    end: new Date("2023-10-07T19:00:00Z"),
    groupId: null,
    visibility: "private",
    type: "event",
    repetition: "once",
    userId: "674f6e0f2b430fa1cb5c011a"
  },
  {
    title: "Group Event 2",
    description: "This is another group event for group 1.",
    start: new Date("2023-10-08T20:00:00Z"),
    end: new Date("2023-10-08T21:00:00Z"),
    groupId: "676f03e101fdc6c25e7a0bd8",
    visibility: "group",
    type: "event",
    repetition: "once",
    userId: "677ae0bb7084870961878893"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/notes-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await Note.deleteMany({});
    await Event.deleteMany({});

    await Note.insertMany(notes);
    await Event.insertMany(events);

    console.log('Data successfully seeded!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
}

seedDatabase();