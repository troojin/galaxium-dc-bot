const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const DURATION_MAP = {
  '60': 60,
  '300': 300,
  '600': 600,
  '1800': 1800,
  '3600': 3600,
  '21600': 21600,
  '86400': 86400,
  '604800': 604800,
};

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout (mute) a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Who to timeout').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('duration')
        .setDescription('How long to timeout for')
        .setRequired(true)
        .addChoices(
          { name: '1 minute', value: '60' },
          { name: '5 minutes', value: '300' },
          { name: '10 minutes', value: '600' },
          { name: '30 minutes', value: '1800' },
          { name: '1 hour', value: '3600' },
          { name: '6 hours', value: '21600' },
          { name: '1 day', value: '86400' },
          { name: '1 week', value: '604800' },
        )
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the timeout')
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const durationKey = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const seconds = DURATION_MAP[durationKey];

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: '❌ I can\'t timeout that user.', ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ You can\'t timeout yourself.', ephemeral: true });

    try {
      await target.timeout(seconds * 1000, reason);

      const humanDuration = durationKey === '60' ? '1 minute'
        : durationKey === '300' ? '5 minutes'
        : durationKey === '600' ? '10 minutes'
        : durationKey === '1800' ? '30 minutes'
        : durationKey === '3600' ? '1 hour'
        : durationKey === '21600' ? '6 hours'
        : durationKey === '86400' ? '1 day'
        : '1 week';

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xffcc00)
            .setTitle('🔇 Member Timed Out')
            .addFields(
              { name: 'User', value: `${target.user.tag}`, inline: true },
              { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
              { name: 'Duration', value: humanDuration, inline: true },
              { name: 'Reason', value: reason }
            )
            .setTimestamp()
        ]
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: '❌ Failed to timeout that user.', ephemeral: true });
    }
  },
};
