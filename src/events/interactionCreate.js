const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // --- Slash Commands ---
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Role restriction check
      const configPath = path.join(__dirname, '../../config.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      if (config.allowedRoleIds?.length) {
        const hasRole = config.allowedRoleIds.some(id => interaction.member.roles.cache.has(id));
        if (!hasRole) {
          return interaction.reply({
            embeds: [new EmbedBuilder().setColor(0xff4444).setDescription('❌ You don\'t have permission to use bot commands.')],
            ephemeral: true,
          });
        }
      }

      // Cooldown system
      const { cooldowns } = client;
      if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Map());
      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const cooldownAmount = (command.cooldown ?? 3) * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expiration = timestamps.get(interaction.user.id) + cooldownAmount;
        if (now < expiration) {
          const remaining = ((expiration - now) / 1000).toFixed(1);
          return interaction.reply({
            embeds: [new EmbedBuilder().setColor(0xff4444).setDescription(`⏱️ Wait **${remaining}s** before using \`/${command.data.name}\` again.`)],
            ephemeral: true,
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(`[CMD ERROR] ${command.data.name}:`, err);
        const msg = { embeds: [new EmbedBuilder().setColor(0xff4444).setDescription('❌ Something went wrong.')], ephemeral: true };
        if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
        else await interaction.reply(msg);
      }
    }

    // --- Button: Verify ---
    if (interaction.isButton() && interaction.customId === 'verify_button') {
      const configPath = path.join(__dirname, '../../config.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      const guild = interaction.guild;
      const member = interaction.member;

      if (!config.verifiedRoleId) {
        return interaction.reply({ content: '❌ Verified role not configured.', ephemeral: true });
      }

      const verifiedRole = guild.roles.cache.get(config.verifiedRoleId);
      if (!verifiedRole) {
        return interaction.reply({ content: '❌ Verified role not found.', ephemeral: true });
      }

      if (member.roles.cache.has(verifiedRole.id)) {
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(0x57f287).setDescription('✅ You\'re already verified!')],
          ephemeral: true,
        });
      }

      // Remove unverified role if set
      if (config.unverifiedRoleId) {
        const unverifiedRole = guild.roles.cache.get(config.unverifiedRoleId);
        if (unverifiedRole && member.roles.cache.has(unverifiedRole.id)) {
          await member.roles.remove(unverifiedRole).catch(() => {});
        }
      }

      await member.roles.add(verifiedRole)
        .then(() => {
          console.log(`[VERIFY] ✅ ${member.user.tag} verified via button.`);
          return interaction.reply({
            embeds: [new EmbedBuilder().setColor(0x57f287).setDescription('✅ You\'ve been verified! Welcome.')],
            ephemeral: true,
          });
        })
        .catch(err => {
          console.error(`[VERIFY ERROR]`, err);
          return interaction.reply({ content: '❌ Failed to assign verified role.', ephemeral: true });
        });
    }
  },
};
