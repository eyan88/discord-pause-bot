const { token } = require('./config.json');
const { Client, Intents } = require('discord.js');

//new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const { commandName } = interaction;

    if(commandName === 'ping') {
        await interaction.reply('Hi');
    } else if(commandName === 'join') {
        await interaction.reply('Joining...');
    }

});


client.login(token);