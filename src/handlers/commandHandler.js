const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function loadCommands(client) {
  const commandsPath = path.join(__dirname, '../commands');
  const categories = fs.readdirSync(commandsPath);
  const commandsArray = [];

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const command = require(path.join(categoryPath, file));
      if (!command?.data || !command?.execute) {
        console.warn(`[WARN] Skipping ${file} — missing data or execute`);
        continue;
      }
      client.commands.set(command.data.name, command);
      commandsArray.push(command.data.toJSON());
    }
  }

  const rest = new REST().setToken(process.env.TOKEN);
  try {
    console.log(`[CMD] Registering ${commandsArray.length} slash commands...`);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsArray }
    );
    console.log(`[CMD] Done.`);
  } catch (err) {
    console.error('[CMD ERROR]', err);
  }
}

module.exports = { loadCommands };
