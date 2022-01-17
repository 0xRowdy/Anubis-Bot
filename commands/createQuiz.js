/* eslint-disable no-undef */
const fetch = require('node-fetch')
const { saveQuiz } = require('../database/mongoose')
const Quiz = require('./models/quiz')
const Question = require('./models/question')

module.exports = {
    name: 'createquiz',
    execute(msg) {
        // eslint-disable-next-line no-shadow
        const filter = (msg) => !msg.author.bot

        function addLinks(quiz) {
            msg.channel
                .send('Please send .txt file containing POAP links.')
                .then(() => {
                    return msg.channel.awaitMessages({
                        filter,
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                })
                .then(async (collected) => {
                    const file = collected.first().attachments.first()?.url
                    if (!file) return console.log('No attached file found')

                    try {
                        msg.channel.send('Reading the file! Fetching data...')

                        const response = await fetch(file)

                        if (!response.ok) {
                            return msg.channel.send(
                                'There was an error with fetching the file:',
                                response.statusText
                            )
                        }
                        // take the response stream and read it to completion
                        const text = await response.text()

                        if (text) {
                            quiz.addLinks(text)
                            console.log(quiz)
                            saveQuiz(quiz)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                })
        }

        function quizFile() {
            msg.channel
                .send('Please send .txt file.')
                .then(() => {
                    return msg.channel.awaitMessages({
                        filter,
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                })
                .then(async (collected) => {
                    const file = collected.first().attachments.first()?.url
                    if (!file) return console.log('No attached file found')

                    try {
                        msg.channel.send('Reading the file! Fetching data...')

                        // fetch the file from the external URL
                        const response = await fetch(file)

                        if (!response.ok) {
                            return msg.channel.send(
                                'There was an error with fetching the file:',
                                response.statusText
                            )
                        }

                        const text = await response.text()

                        if (text) {
                            // eslint-disable-next-line no-shadow
                            const quizFile = text.split(/\n/)

                            const quiz = new Quiz(
                                quizFile[0].toLowerCase(),
                                quizFile[1]
                            )

                            for (let i = 3; i < quizFile.length - 1; i++) {
                                if (quizFile[i].includes('#')) {
                                    question = new Question(
                                        quizFile[i].substring(1)
                                    )
                                }
                                quizFile[i].includes('*') &&
                                    question.addAnswer(quizFile[i])
                                quizFile[i].includes('//') &&
                                    quiz.addQuestion(question)
                            }
                            addLinks(quiz)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                })
        }
        quizFile()
    },
}
