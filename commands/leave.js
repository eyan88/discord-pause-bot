const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leaves present voice channel'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);

        if(!connection) {
            interaction.reply('Not in a voice channel');
        } else {
            connection.destroy();
            interaction.reply(`Leaving ${interaction.member.voice.channel}`);
        }
    },
};