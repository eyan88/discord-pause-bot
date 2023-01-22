const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bad')
        .setDescription('Random Pokemon')
        .addStringOption(option => 
            option.setName('string')
                .setDescription('Pokemon Name or ID')
                .setRequired(false)),
    async execute(interaction) {
        let pokemonName = getPokemonName(interaction);
        console.log(pokemonName);

        try {
            let pokemon, pokemonSpecies, pokemonData, speciesData;

            // Behavior when given Pokemon with alternate forms
            if(typeof(pokemonName) !== 'number' && pokemonName.includes('-')) {
                pokemon = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
                pokemonData = await axios.get(pokemon);
                speciesData = await axios.get(pokemonData.data.species.url);
                pokemonName = pokemonData.data.name;
            } else {
                pokemonSpecies = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
                speciesData = await axios.get(pokemonSpecies);
                pokemonData = await axios.get(speciesData.data.varieties[0].pokemon.url);
                pokemonName = pokemonData.data.name;
            }
            
            // embed info
            const pokemonInfoEmbed = new MessageEmbed()
                .setColor(speciesData.data.color.name.toUpperCase())
                .setTitle(capitalizeText(pokemonData.data.name))
                .setURL(getBulbapediaURL(pokemonName))
                .setAuthor('National Dex # : ' + pokemonData.data.id)
                .setDescription(getFlavorText(speciesData))
                .setThumbnail(pokemonData.data.sprites.front_default)
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: 'Type', value: getTypes(pokemonData.data), inline: true },
                    { name: 'Inline field title', value: 'Some value', inline: true },
                )
                .addField('Inline field title', 'Some value here', true)
                .setTimestamp()
                .setFooter('via PokeAPI v2', 'https://i.imgur.com/AfFp7pu.png');
            
            interaction.reply({ embeds: [pokemonInfoEmbed], ephemeral: false });

        } catch(err) {
            interaction.reply({content: 'Pokemon not found', ephemeral: true});
            return;
        }
    },
};

// Returns a pokemon name or ID, if name/ID isn't provided, selects a random ID
const getPokemonName = (interaction) => {
    let name;
    if(!interaction.options.get('string')) {
        name = getRandomNum(898);
    } else {
        name = interaction.options.get('string').value;
        name = name.toLowerCase();
    }
    return name;
};

// Gets Bulbapedia Wiki URL for pokemonName parameter
const getBulbapediaURL = (pokemonName) => {
    let urlAttachment = pokemonName.toLowerCase();
    if(urlAttachment.includes('-')) {
        urlAttachment = urlAttachment.slice(0,urlAttachment.indexOf('-'));
    }
    return `https://bulbapedia.bulbagarden.net/wiki/${urlAttachment}`;
}

// Gets Flavor Text from JSON pokemon species data
const getFlavorText = (speciesData) => {
    let lang = '';
    let rng;
    while(lang !== 'en') {
        rng = getRandomNum(speciesData.data.flavor_text_entries.length-1);
        lang = speciesData.data.flavor_text_entries[rng].language.name;
    }
    return speciesData.data.flavor_text_entries[rng].flavor_text;
};

// Gets Types from JSON pokemon data
const getTypes = (data) => {
    let typesString = ''
    if(data.types.length == 1) {
        typesString = capitalizeText(data.types[0].type.name);
    } else {
        typesString = capitalizeText(data.types[0].type.name) + "/" + capitalizeText(data.types[1].type.name);
    }
    return typesString
};

// Helper function to capitalize text (e.g. when retrieving from JSON)
const capitalizeText = (text) => {
    if(typeof(text) === 'undefined') {
        return 'N/A';
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
};

// returns a random number from 0 to @param max
const getRandomNum = (max) => {
    return Math.floor(Math.random() * max);
};