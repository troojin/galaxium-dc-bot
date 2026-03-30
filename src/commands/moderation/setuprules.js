const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setuprules')
    .setDescription('Post the server rules embed in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🌌 Galaxium Rules')
      .setDescription(
        'yeah, cursing is allowed. just don’t be weird, toxic, or make the server worse for everyone.\n\n' +
        'this isn’t a corporate server — just use common sense and you’ll be fine.'
      )
      .addFields(
        {
          name: '1. Don’t be a werido',
          value:
            'talk however you want, seriously. just don’t target people, harass them, or try to start drama. ' +
            'arguing is fine being annoying or toxic isn’t.',
        },
        {
          name: '2. No spam / flooding',
          value:
            'don’t spam messages, emojis, reactions, or mentions. ' +
            'don’t ping people repeatedly or try to lag the chat on purpose.',
        },
        {
          name: '3. Keep it safe',
          value:
            'no NSFW, no gore, no weird sexual stuff, and nothing that could get the server flagged or deleted.',
        },
        {
          name: '4. No hateful behavior',
          value:
            'no slurs, racism, homophobia, or any targeted hate. ' +
            'jokes are fine until they cross the line don’t cross it.',
        },
        {
          name: '5. No random advertising',
          value:
            'don’t promote your server, socials, products, or projects unless staff gives permission. ' +
            'this includes DM advertising.',
        },
        {
          name: '6. Use channels correctly',
          value:
            'post things where they belong. don’t dump everything into one channel or go off-topic everywhere.',
        },
        {
          name: '7. No leaking or stealing',
          value:
            'don’t share private builds, accounts, files, or anything that isn’t yours to share. ' +
            'respect other people’s work.',
        },
        {
          name: '8. No scams or shady stuff',
          value:
            'no phishing links, fake giveaways, token grabbers, or suspicious downloads. ' +
            'if it looks sketchy, don’t post it.',
        },
        {
          name: '9. Respect staff decisions',
          value:
            'staff aren’t here to argue all day. if they tell you to stop, just stop. ' +
            'if there’s an issue, handle it calmly instead of escalating.',
        },
        {
          name: '10. Have fun',
          value:
            'just have fun talk about ai etc',
        },
        {
          name: '⚖️ Legal',
          value:
            '[Terms of Service](https://www.galaxium.lol/legal/terms)\n' +
            '[Privacy Policy](https://www.galaxium.lol/legal/privacy)',
        },
        {
          name: '🛠️ Moderation',
          value:
            'breaking rules can lead to warnings, mutes, kicks, or bans.\n' +
            'serious stuff can skip warnings completely.',
        }
      )
      .setFooter({
        text: 'By staying in Galaxium, you agree to follow these rules and our legal terms.',
      })
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Rules posted.', ephemeral: true });
  },
};