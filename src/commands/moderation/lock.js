const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel so members cannot send messages.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(opt =>
      opt.setName('channel').setDescription('Channel to lock (defaults to current)')
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the lock')
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    });

    await channel.send(`# 🔒 CHANNEL LOCKED\n**Reason:** ${reason}\n**Locked by:** ${interaction.user}`);

    return interaction.reply({ content: `🔒 ${channel} has been locked.`, ephemeral: true });
  },
};
