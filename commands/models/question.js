class Question {
  constructor(description) {
    this.description = description;
    this.answers = [];
  }

  addAnswer(answer) {
    answer.includes("$")
      ? this.answers.push({
          text: answer.substring(2),
          isCorrect: true,
        })
      : this.answers.push({
          text: answer.substring(1),
          isCorrect: false,
        });
  }
}

module.exports = Question
