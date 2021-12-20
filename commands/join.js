const { SlashCommandBuilder } = require('@discordjs/builders');
const voice = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins present voice channel'),
    async execute(interaction) {
        if(!interaction.member.voice.channel) {
            interaction.reply('Please join a voice channel');
        } else {
            voice.joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                selfDeaf: false,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
            interaction.reply(`Joining ${interaction.member.voice.channel}`);
        }
    },

};