const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./src/handlers/commandHandler');
const { loadEvents } = require('./src/handlers/eventHandler');
const { startVerifyServer } = require('./src/verify/server');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

(async () => {
  await loadCommands(client);
  await loadEvents(client);
  startVerifyServer(client);
  await client.login(process.env.TOKEN);
})();
