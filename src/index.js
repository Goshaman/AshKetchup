const { Client, IntentsBitField } = require('discord.js');
const { token } = require('../config.json');
const insults = require('../insults.json')

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });
const greetingReplies = ["Kill yourself", "STFU", "No one asked", "Get better"]
var pokemonName = ''
var hintReply = ''
var pokemonFound = false

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

client.on('ready', (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand) return;

    if(interaction.commandName == 'hey') {
        interaction.reply('hey!');
    }
});

function beginCatchPokemon(userMessage) {
    userMessage.reply('I gotta catch this!');
    userMessage.reply('Information!!');
    pokemonName = '';
}

function continueCatch(userMessage) {
    hintReply = userMessage.content.substring(15, userMessage.content.length - 1);
    hintReply = hintReply.replaceAll("\\", "");
    console.log(hintReply);
    for(var i = 0; i < hintReply.length; i++) {
        if(hintReply.charAt(i) == '_' && pokemonName.charAt(i)) continue;
        pokemonName = pokemonName.replaceAt(i, hintReply.charAt(i));
        console.log(pokemonName);
    };
    pokemonFound = true;
    for(var k = 0; k < pokemonName.length; k++) {
        if(pokemonName.charAt(k) == '_') {
            pokemonFound = false;
        }
    };
    if(pokemonFound) {
        pokemonFound = false;
        userMessage.channel.send(`My big brain has concluded that the pokemon is a ${pokemonName}`);
        pokemonName = '';
        return;
    }
    setTimeout(function(){
        userMessage.channel.send('I need more information');
    }, 10000);
}

client.on('messageCreate', (message) => {
    if(message.author.id == '1083580526578900992') return;

    if(message.content.includes('Ash') || message.content.includes('ash') || message.content.includes('Ketchup') || message.content.includes('ketchup')) {
        message.reply('Don\'t say my name again. This is an idiotic insult as punishment')
        message.reply(insults[Math.floor(Math.random() * insults.length)]);
    }
    if(message.embeds[0] != undefined) {
        if(message.author.bot && message.author.id == '716390085896962058' && (message.embeds[0].data.title == 'A wild pokémon has appeared!' || message.embeds[0].data.title.includes('A new wild pokémon has appeared!'))) {
            beginCatchPokemon(message)
        }
    }
    if(message.author.bot && message.author.id == '716390085896962058' && message.content.includes('The pokémon is')) {
        continueCatch(message)
    }
});

client.login(token);