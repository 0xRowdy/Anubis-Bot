const mongoose = require("mongoose");

const Quiz = mongoose.model(
  "Quiz",
  new mongoose.Schema({
    name: String,
    description: String,
    questions: [
      {
        description: String,
        answers: [
          {
            text: {
              type: String,
              required: true,
            },
            isCorrect: {
              type: Boolean,
              required: true,
              default: false,
            },
          },
        ],
      },
    ],
    links: Array,
  })
);

module.exports = Quiz;
