const fs = require('fs');
const { token } = require('./config.json');
const { Client, Collection, Intents } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

// new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]});

// Dynamically retrieves command files in commands folder
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Dynamically retrieves event files in events folder
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
    const event = require(`./events/${file}`);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

/*client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});*/

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);