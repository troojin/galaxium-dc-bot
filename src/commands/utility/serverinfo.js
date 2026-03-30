const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display info about this server.'),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.members.fetch();

    const owner = await guild.fetchOwner();
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = guild.memberCount - botCount;
    const roles = guild.roles.cache.size - 1; // exclude @everyone
    const channels = guild.channels.cache.size;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👑 Owner', value: `${owner.user.tag}`, inline: true },
        { name: '🆔 Server ID', value: guild.id, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👥 Members', value: `${guild.memberCount} total\n${humanCount} humans · ${botCount} bots`, inline: true },
        { name: '💬 Channels', value: `${channels}`, inline: true },
        { name: '🏷️ Roles', value: `${roles}`, inline: true },
        { name: '🚀 Boost Level', value: `Tier ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`, inline: true },
        { name: '✅ Verification', value: guild.verificationLevel.toString(), inline: true },
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
