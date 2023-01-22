const fs = require('fs');
require('dotenv').config();
// const { token } = require('./config.json');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

// Dynamically retrieve command files in commands folder
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Dynamically retrieve event files in events folder
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
    const event = require(`./events/${file}`);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.TOKEN);