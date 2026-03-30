const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Display info about a user.')
    .addUserOption(opt =>
      opt.setName('user').setDescription('User to inspect (defaults to you)')
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const roles = member
      ? member.roles.cache
          .filter(r => r.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map(r => r.toString())
          .slice(0, 10)
          .join(', ') || 'None'
      : 'Not in server';

    const embed = new EmbedBuilder()
      .setColor(member?.displayHexColor ?? 0x5865f2)
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 User ID', value: user.id, inline: true },
        { name: '🤖 Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
      );

    if (member) {
      embed.addFields(
        { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: '🎖️ Top Role', value: member.roles.highest.toString(), inline: true },
        { name: `🏷️ Roles (${member.roles.cache.size - 1})`, value: roles },
      );
    }

    embed.setFooter({ text: `Requested by ${interaction.user.tag}` }).setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
