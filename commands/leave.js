const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leaves present voice channel'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);
        console.log(connection);

        //if not in a voice channel, then reply with "Not in a voice channel"
        if(!connection) {
            interaction.reply('Not in a voice channel');
        } else {        //else leave the voice channel and destroy connection
            connection.destroy();
            interaction.reply(`Leaving ${interaction.member.voice.channel}`);
        }
    },
};