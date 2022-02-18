require('dotenv').config()
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');
const fs = require('fs');

const commands = [
    new SlashCommandBuilder().setName('quote').setDescription('Answer with a quote from Marc Droin!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

const MASTERCLASS = fs.readFileSync('masterclass.md').toString().split("\n");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'quote') {
        const element = MASTERCLASS[Math.floor(Math.random() * MASTERCLASS.length)].slice(2)
        await interaction.reply(element);
    }
});

client.login(process.env.TOKEN);