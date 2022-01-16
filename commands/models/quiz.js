class Quiz {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.questions = [];
    this.links;
  }

  addLinks(text) {
    text = text.split(/\n/).filter((el) => el.indexOf("http") !== -1);
    this.links = text;
  }

  addQuestion(data) {
    this.questions.push(data);
  }
}

module.exports = Quiz