const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(opt =>
      opt.setName('amount').setDescription('Number of messages to delete (1–100)').setRequired(true).setMinValue(1).setMaxValue(100)
    )
    .addUserOption(opt =>
      opt.setName('user').setDescription('Only delete messages from this user')
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const amount = interaction.options.getInteger('amount');
    const filterUser = interaction.options.getUser('user');

    let messages = await interaction.channel.messages.fetch({ limit: 100 });

    // Filter to messages newer than 14 days (Discord limit)
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    messages = messages.filter(m => m.createdTimestamp > twoWeeksAgo);

    if (filterUser) {
      messages = messages.filter(m => m.author.id === filterUser.id);
    }

    messages = [...messages.values()].slice(0, amount);

    if (!messages.length) {
      return interaction.editReply('❌ No eligible messages found to delete.');
    }

    const deleted = await interaction.channel.bulkDelete(messages, true).catch(() => null);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865f2)
          .setDescription(`🗑️ Deleted **${deleted?.size ?? 0}** messages${filterUser ? ` from ${filterUser.tag}` : ''}.`)
      ]
    });
  },
};
