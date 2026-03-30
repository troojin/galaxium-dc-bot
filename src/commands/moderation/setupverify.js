const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupverify')
    .setDescription('Post the verification button in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Verify Your Account')
      .setDescription('Click the button below to verify yourself and gain access to the server.');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verify_button')
        .setLabel('Verify Me')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('✅')
    );

    const msg = await interaction.channel.send({ embeds: [embed], components: [row] });

    const configPath = path.join(__dirname, '../../../config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    config.verifyMessageId = msg.id;
    config.verifyChannelId = interaction.channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    return interaction.reply({ content: '✅ Verify message posted.', ephemeral: true });
  },
};
