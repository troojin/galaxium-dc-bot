const config = require('../../config.json');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // --- Auto-Role ---
    if (config.autoRoles?.length) {
      await member.guild.roles.fetch();
      for (const roleId of config.autoRoles) {
        const role = member.guild.roles.cache.find(r => r.id === roleId);
        if (role) {
          await member.roles.add(role)
            .then(() => console.log(`[AUTO-ROLE] ✅ Assigned "${role.name}" to ${member.user.tag}`))
            .catch(err => console.warn(`[AUTO-ROLE] ❌ Couldn't assign "${role.name}" to ${member.user.tag}:`, err.message));
        } else {
          console.warn(`[AUTO-ROLE] ❌ Role ${roleId} not found in guild.`);
        }
      }
    }

    // --- Verify DM ---
    if (config.verifiedRoleId) {
      const verifyUrl = process.env.VERIFY_URL || 'http://localhost:3000';

      await member.user.send({
        embeds: [{
          color: 0x5865f2,
          title: `Welcome to ${member.guild.name}!`,
          description: `To gain access, verify your account by logging in with Discord.\n\n[**Click here to verify**](${verifyUrl})\n`,
          footer: { text: 'You will be asked to log in with Discord.' },
        }]
      }).then(() => console.log(`[VERIFY] 📨 Sent verify link to ${member.user.tag}`))
        .catch(() => console.warn(`[VERIFY] ⚠️ Couldn't DM ${member.user.tag} — DMs may be closed.`));
    }
  },
};
