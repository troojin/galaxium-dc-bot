// Simple in-memory token store
// For production, swap this out for a database (SQLite, MongoDB, etc.)

const tokens = new Map(); // token -> { userId, guildId, expires }

const TOKEN_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function generateToken(userId, guildId) {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  tokens.set(token, {
    userId,
    guildId,
    expires: Date.now() + TOKEN_EXPIRY_MS,
  });
  return token;
}

function consumeToken(token) {
  const data = tokens.get(token);
  if (!data) return null;
  if (Date.now() > data.expires) {
    tokens.delete(token);
    return null;
  }
  tokens.delete(token); // single use
  return data;
}

module.exports = { generateToken, consumeToken };
