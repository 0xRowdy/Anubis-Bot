const { fetchQuiz, fetchLink } = require('../database/mongoose')
const { MessageActionRow, MessageSelectMenu } = require('discord.js')

module.exports = {
    name: 'takequiz',
    async execute(client, message) {
        try {
            let index = 0
            let correct = 0

            const quiz = await message.channel
                .send('Whats the name of the quiz you want to take?')
                .then(() => {
                    return message.channel.awaitMessages({
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                })
                .then(async (collected) => {
                    collected = collected.first().content.toLowerCase()
                    return await fetchQuiz(collected)
                })

            const questions = quiz?.questions.map((question) => {
                return question.description
            })

            const rows = quiz?.questions.map((question) => {
                const answers = question.answers.map((answer, i) => {
                    return {
                        label: `${i}`,
                        description: answer.text,
                        value: `Option ${i} ${answer.isCorrect}`,
                    }
                })
                return new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Nothing selected')
                        .addOptions(answers)
                )
            })

            const collector = message.channel.createMessageComponentCollector({
                max: rows.length,
            })

            collector.on('collect', (collected) => {
                const answer = collected.values[0]
                answer.includes('true') && correct++
                index++
                sendQuestion()
            })

            collector.on('end', async () => {
                correct === rows.length
                    ? message.channel.send({
                          content: `Perfect! Have this POAP! ${await fetchLink(
                              quiz.name
                          )}`,
                      })
                    : message.channel.send({
                          content:
                              'Whoops! You answered a few wrong. Try again!',
                      })
            })

            const sendQuestion = () => {
                index < rows.length &&
                    message.channel.send({
                        content: questions[index],
                        components: [rows[index]],
                    })
            }
            sendQuestion()
        } catch (err) {
            console.log(err)
            message.channel.send(err)
        }
    },
}
