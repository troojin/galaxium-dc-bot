const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Who to kick').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the kick')
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: '❌ I can\'t kick that user (check my role position).', ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ You can\'t kick yourself.', ephemeral: true });

    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff9900)
            .setTitle(`You were kicked from ${interaction.guild.name}`)
            .addFields({ name: 'Reason', value: reason })
        ]
      }).catch(() => {}); // DM may be closed

      await target.kick(reason);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff9900)
            .setTitle('👢 Member Kicked')
            .addFields(
              { name: 'User', value: `${target.user.tag}`, inline: true },
              { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
              { name: 'Reason', value: reason }
            )
            .setTimestamp()
        ]
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: '❌ Failed to kick that user.', ephemeral: true });
    }
  },
};
