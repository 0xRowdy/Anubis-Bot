const Quiz = require('./schema/quiz')

// to fetch quiz
const fetchQuiz = async (data) => {
    const quiz = await Quiz.findOne({ name: data })
    if (!quiz) throw 'Quiz not found! Please try again.'
    return quiz
}

const saveQuiz = async (data) => {
    Quiz.create(data)
        .then(() => {
            return 'Success! Quiz added to database.'
        })
        .catch((e) => console.log(e))
}

const fetchLink = async (data) => {
    const quiz = await fetchQuiz(data)
    const link = quiz.links.pop()
    await quiz.save()

    return link
}

module.exports = { saveQuiz, fetchQuiz, fetchLink }
