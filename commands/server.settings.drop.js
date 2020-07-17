const { ServerSettings } = require("../models/server.settings");

module.exports = {
  name: "settings--drop",
  description: "Drop server settings",
  args: false,
  async execute(msg, _args)
  {
    const settings = await ServerSettings.findOne({ where: { name: msg.channel.guild.name } });

    if (settings)
    {
      if (msg.member.roles.cache.some(r => r.name === settings.adminRole))
      {
        const deletedCount = await ServerSettings.destroy({ where: { id: settings.id }});
        const { channel } = msg;

        deletedCount === 1 ? channel.send("Настройки сброшены") : channel.send("Пройзошла ощибка");
      }
    }
  }
};