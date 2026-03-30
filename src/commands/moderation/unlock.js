const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel so members can send messages again.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(opt =>
      opt.setName('channel').setDescription('Channel to unlock (defaults to current)')
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: null,
    });

    await channel.send(`# 🔓 CHANNEL UNLOCKED\n**Unlocked by:** ${interaction.user}`);

    return interaction.reply({ content: `🔓 ${channel} has been unlocked.`, ephemeral: true });
  },
};
