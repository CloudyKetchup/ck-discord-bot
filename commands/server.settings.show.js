const { ServerSettings } = require("../models/server.settings");

module.exports = {
  name: "settings--show",
  description: "Show server settings",
  args: false,
  async execute(msg, _args)
  {
    const settings = await ServerSettings.findOne({ where: { name: msg.channel.guild.name } });

    if (settings)
    {
      if (msg.member.roles.cache.some(r => r.name === settings.adminRole))
      {
        msg.channel.send(`Настройки:\n Роль админа -> ${settings.adminRole}`);
      }
    } else
    {
      const setup = require("./server.setup");
      const { prefix } = require("../config.json");

      msg.channel.send(`Настройки cервака отсутсвуют, ${prefix}${setup.name} ${setup.usage}`);
    }
  }
};