const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by their ID.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(opt =>
      opt.setName('user_id').setDescription('The user\'s Discord ID').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the unban')
    ),

  async execute(interaction) {
    const userId = interaction.options.getString('user_id');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    try {
      const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
      if (!ban) return interaction.reply({ content: '❌ That user is not banned.', ephemeral: true });

      await interaction.guild.members.unban(userId, reason);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57f287)
            .setTitle('✅ User Unbanned')
            .addFields(
              { name: 'User', value: `${ban.user.tag} (${userId})`, inline: true },
              { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
              { name: 'Reason', value: reason }
            )
            .setTimestamp()
        ]
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: '❌ Failed to unban that user. Double-check the ID.', ephemeral: true });
    }
  },
};
