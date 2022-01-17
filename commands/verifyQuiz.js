const { fetchQuiz, fetchLink } = require("../database/mongoose");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "verifyquiz",
  async execute(client, message, args) {
    try {
      let index = 0;
      let correct = 0;

      const quiz = await fetchQuiz(process.env.VERIFY_QUIZ_NAME);

      const questions = quiz?.questions.map((question) => {
        return question.description;
      });

      const rows = quiz?.questions.map((question) => {
        const answers = question.answers.map((answer, i) => {
          return {
            label: `${i}`,
            description: answer.text,
            value: `Option ${i} ${answer.isCorrect}`,
          };
        });
        return new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder("Nothing selected")
            .addOptions(answers)
        );
      });

      const collector = message.channel.createMessageComponentCollector({
        max: rows.length,
      });

      collector.on("collect", (collected) => {
        const answer = collected.values[0];
        answer.includes("true") && correct++;
        index++;
        sendQuestion();
      });

      collector.on("end", async () => {
        if (correct === rows.length) {
          message.member.roles.add(
            message.guild.roles.cache.find((r) => r.name === "Verified")
          );
          message.member.roles.remove(
            message.guild.roles.cache.find((r) => r.name === "Unverified")
          );
          await message.channel.send({
            content: `Perfect, you now have access to the channels! Also, have this POAP! ${await fetchLink(
              quiz.name
            )}`,
          });
          await wait(2500);
          await message.channel.send("You have five minutes until this channel is deleted; so claim quick!");
          await wait(300000);
          await message.channel.delete();
        } else {
          message.channel.send({
            content: `Whoops! You answered ${
              rows.length - correct
            } wrong. Try again using the "!verify" command.`,
          });
        }
      });

      const sendQuestion = () => {
        index < rows.length &&
          message.channel.send({
            content: questions[index],
            components: [rows[index]],
          });
      };
      sendQuestion();
    } catch (err) {
      console.log(err);
      message.channel.send(err);
    }
  },
};
