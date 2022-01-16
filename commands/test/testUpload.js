const quiz = require("../database/exampleQuiz");
const { saveQuiz } = require("../database/mongoose");

module.exports = {
  name: "testupload",
  execute() {
    saveQuiz(quiz);
  },
};
