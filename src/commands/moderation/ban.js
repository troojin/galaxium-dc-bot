const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Who to ban').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the ban')
    )
    .addIntegerOption(opt =>
      opt.setName('delete_days').setDescription('Days of messages to delete (0–7)').setMinValue(0).setMaxValue(7)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const deleteDays = interaction.options.getInteger('delete_days') ?? 0;

    if (!target) return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    if (!target.bannable) return interaction.reply({ content: '❌ I can\'t ban that user (check my role position).', ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ You can\'t ban yourself.', ephemeral: true });

    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff4444)
            .setTitle(`You were banned from ${interaction.guild.name}`)
            .addFields({ name: 'Reason', value: reason })
        ]
      }).catch(() => {});

      await target.ban({ reason, deleteMessageSeconds: deleteDays * 86400 });

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff4444)
            .setTitle('🔨 Member Banned')
            .addFields(
              { name: 'User', value: `${target.user.tag}`, inline: true },
              { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
              { name: 'Reason', value: reason },
              { name: 'Messages Deleted', value: `${deleteDays} day(s)`, inline: true }
            )
            .setTimestamp()
        ]
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: '❌ Failed to ban that user.', ephemeral: true });
    }
  },
};
