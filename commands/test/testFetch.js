const { fetchQuiz } = require("../../database/mongoose");

module.exports = {
  name: "testfetch",
  execute() {
    fetchQuiz("Test Quiz");
  },
};
