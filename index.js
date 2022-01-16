const {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();
const { prefix, token } = require("./config.json");

// adding to client
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new Collection();

const init = () => {
  // load commands
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }

  // connect to database
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Successfully connected to database"))
    .catch((e) => console.log(e));

  client.login(token);
};

//event handling 
client.once("ready", () => {
  console.log("The client is ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === "select") {
    await interaction.update({
      content: `Answer collected`,
      components: [],
    });
  }
});

// command handling
client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    client.commands.get("ping").execute(message);
  }

  if (command === "createquiz") {
    client.commands.get("createquiz").execute(message, args);
  }

  if (command === "takequiz") {
    client.commands.get("takequiz").execute(client, message);
  }

  // test commands
  if (command === "testupload") {
    client.commands.get("testupload").execute(message);
  }

  if (command === "testfetch") {
    client.commands.get("testfetch").execute(message);
  }
});

init();
