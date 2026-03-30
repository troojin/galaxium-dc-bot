module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[READY] Logged in as ${client.user.tag}`);
    client.user.setActivity('your server 👁️', { type: 3 }); // WATCHING
  },
};
