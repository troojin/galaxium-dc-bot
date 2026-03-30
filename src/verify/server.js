const express = require('express');
const path = require('path');
const { consumeToken } = require('./tokenStore');
const config = require('../../config.json');

function startVerifyServer(client) {
  const app = express();
  const PORT = process.env.VERIFY_PORT || 3000;

  // Serve the static verify page
  app.use(express.static(path.join(__dirname, 'public')));

  // Verify endpoint
  app.get('/verify', async (req, res) => {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided.' });
    }

    const data = consumeToken(token);
    if (!data) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }

    try {
      const guild = client.guilds.cache.get(data.guildId);
      if (!guild) return res.status(500).json({ success: false, message: 'Server not found.' });

      const member = await guild.members.fetch(data.userId).catch(() => null);
      if (!member) return res.status(400).json({ success: false, message: 'You are no longer in the server.' });

      // Remove unverified roles
      if (config.unverifiedRoleId) {
        const unverifiedRole = guild.roles.cache.get(config.unverifiedRoleId);
        if (unverifiedRole && member.roles.cache.has(unverifiedRole.id)) {
          await member.roles.remove(unverifiedRole).catch(() => {});
        }
      }

      // Add verified role
      if (config.verifiedRoleId) {
        const verifiedRole = guild.roles.cache.get(config.verifiedRoleId);
        if (verifiedRole) {
          await member.roles.add(verifiedRole).catch(() => {});
        }
      }

      console.log(`[VERIFY] ✅ ${member.user.tag} verified successfully.`);
      return res.json({ success: true, message: 'You are now verified!' });

    } catch (err) {
      console.error('[VERIFY ERROR]', err);
      return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
  });

  app.listen(PORT, () => {
    console.log(`[VERIFY] Server running on http://localhost:${PORT}`);
  });
}

module.exports = { startVerifyServer };
