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
        const { adminRole, streamer: { display_name } } = settings;

        msg.channel.send(`Настройки:\n Роль админа -> ${adminRole}\n Стример -> ${display_name}`);
      }
    } else
    {
      const { name, usage } = require("./server.setup");
      const { prefix }      = require("../config.json");

      msg.channel.send(`Настройки cервака отсутсвуют, Команда ${prefix}${name} ${usage}`);
      msg.channel.send(`Ну например ${prefix}${name} Админ BigLongFatGun`)
    }
  }
};