const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Options } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poke')
        .setDescription('Random Pokemon')
        .addStringOption(option => 
            option.setName('string')
                .setDescription('Pokemon Name or ID')
                .setRequired(false)),
    async execute(interaction) {

        let pokemonName;
        if(!interaction.options.get('string')) {
            pokemonName = getRandomNum(898);
        } else {
            pokemonName = interaction.options.get('string').value;
        }

        let pokemonData = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        const { data } = await axios.get(pokemonData);

        let pokemonSpecies = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
        const speciesData = await axios.get(pokemonSpecies);

        const pokemonInfoEmbed = new MessageEmbed()
            .setColor('GREY')
            .setTitle(capitalizeText(data.name))
            .setURL('https://discord.js.org/')
            .setAuthor('National Dex # : ' + data.id)
            .setDescription(getFlavorText(speciesData))
            .setThumbnail(data.sprites.front_default)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Regular field title', value: 'Some value here' },
                { name: 'Type', value: getTypes(data), inline: true },
                { name: 'Inline field title', value: 'Some value', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setTimestamp()
            .setFooter('via PokeAPI', 'https://i.imgur.com/AfFp7pu.png');
        
        interaction.reply({ embeds: [pokemonInfoEmbed], ephemeral: true });
    },
};

const getTypes = (data) => {
    let typesString = ''
    if(data.types.length == 1) {
        typesString = capitalizeText(data.types[0].type.name);
    } else {
        typesString = capitalizeText(data.types[0].type.name) + "/" + capitalizeText(data.types[1].type.name);
    }
    return typesString
}

const getFlavorText = (speciesData) => {
    let lang = '';
    let rng;
    while(lang !== 'en') {
        rng = getRandomNum(speciesData.data.flavor_text_entries.length-1);
        lang = speciesData.data.flavor_text_entries[rng].language.name;
    }
    return speciesData.data.flavor_text_entries[rng].flavor_text;
}

const capitalizeText = (text) => {
    if(typeof(text) === 'undefined') {
        return 'N/A';
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const getRandomNum = (max) => {
    return Math.floor(Math.random() * max);
}