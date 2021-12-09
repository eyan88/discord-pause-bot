const { token } = require('./config.json');
const { Client, Intents } = require('discord.js');

//new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.login(token);