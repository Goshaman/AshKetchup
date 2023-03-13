const { REST, Routes } = require('discord.js')
const { token, clientId, guildId } = require('../config.json');

const commands = [
    {
        name: 'hey',
        description: 'replies with hey!',
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try{
        console.log('Registering slash commands...')

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), 
            { body: commands }
        )

        console.log('Slash commands registered successfully')
    } catch (error) {
        console.log('There was an error: ${error}')
    }
})();