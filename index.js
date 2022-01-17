const { Client, Collection, Intents } = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();
const { prefix, token } = require("./config.json");

// adding to client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
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

client.on("guildMemberAdd", async (member) => {
  member.roles.add(
    member.guild.roles.cache.find((r) => r.name === "Unverified")
  );
  const verifyChannelName = `${member.user.username}s-verification`;
  await member.guild.channels.create(verifyChannelName, {
    type: "GUILD_TEXT",
    permissionOverwrites: [
      {
        id: member.user.id,
        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
      },
      {
        id: member.guild.roles.everyone,
        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
      },
    ],
  });
  await member.guild.channels.cache
    .get("932128244700942386")
    .send(
      `Welcome <@${member.user.id}>! Please respond to Anubis and to complete verification`
    );

  await member.guild.channels.cache
    .find((channel) => channel.name === verifyChannelName)
    .send("Type '!verify' to initiate the test")
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

  if (command === "verify") {
    if(!message.member.roles.cache.find(r => r.name === "Unverified")) return
    client.commands.get("verifyquiz").execute(client, message);
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
