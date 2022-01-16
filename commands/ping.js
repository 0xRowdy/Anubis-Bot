module.exports = {
    name: 'ping',
    description: 'responds with Pong!',
    execute(msg) {
        msg.channel.send("Pong!")
    }
}