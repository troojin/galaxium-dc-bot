const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Add or remove a role from a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Give a role to a member')
        .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true))
        .addRoleOption(opt => opt.setName('role').setDescription('Role to add').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove a role from a member')
        .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true))
        .addRoleOption(opt => opt.setName('role').setDescription('Role to remove').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const target = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (role.managed) return interaction.reply({ content: '❌ That role is managed by an integration.', ephemeral: true });
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '❌ That role is higher than or equal to my highest role.', ephemeral: true });
    }

    try {
      if (sub === 'add') {
        if (target.roles.cache.has(role.id)) {
          return interaction.reply({ content: `❌ ${target} already has that role.`, ephemeral: true });
        }
        await target.roles.add(role);
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x57f287)
              .setDescription(`✅ Added **${role.name}** to ${target}.`)
          ]
        });
      } else {
        if (!target.roles.cache.has(role.id)) {
          return interaction.reply({ content: `❌ ${target} doesn't have that role.`, ephemeral: true });
        }
        await target.roles.remove(role);
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff9900)
              .setDescription(`✅ Removed **${role.name}** from ${target}.`)
          ]
        });
      }
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: '❌ Failed to modify that role.', ephemeral: true });
    }
  },
};
