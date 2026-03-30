const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set the slowmode for this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(opt =>
      opt.setName('seconds').setDescription('Slowmode in seconds (0 to disable, max 21600)').setRequired(true).setMinValue(0).setMaxValue(21600)
    ),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);

    const msg = seconds === 0 ? 'Slowmode **disabled**.' : `Slowmode set to **${seconds} second(s)**.`;
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865f2)
          .setDescription(`🐢 ${msg}`)
      ]
    });
  },
};
