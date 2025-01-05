const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  type: {
    type: String,
    enum: ["event", "task", "birthday"],
    required: true,
  },
  repetition: {
    type: String,
    enum: ["once", "daily", "weekly", "monthly", "custom"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: function (value) {
        return mongoose.Types.ObjectId.isValid(value);
      },
      message: (props) => `${props.value} n'est pas un ObjectId valide !`,
    },
  },
});

module.exports = mongoose.model("Event", eventSchema);
