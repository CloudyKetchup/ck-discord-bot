const { ServerSettings } = require("../models/server.settings");

module.exports = {
  name: "settings--show",
  description: "Show server settings",
  args: false,
  async execute(msg, _args)
  {
    const { channel } = msg;
    const settings = await ServerSettings.findOne({ where: { name: msg.channel.guild.name } });

    if (settings)
    {
      if (msg.member.roles.cache.some(r => r.name === settings.adminRole))
      {
        const { getEmbed } = require("../embeds/server.settings.embed");
        const { client }   = require("../index");

        const bot = channel.guild
          .members
          .cache
          .array()
          .find(member => member.user.id === client.user.id);

        channel.send(getEmbed(channel.guild, settings, bot.displayHexColor));
      }
    } else
    {
      const { name, usage } = require("./server.setup");
      const { prefix }      = require("../config.json");

      channel.send(`Настройки cервака отсутсвуют, Команда ${prefix}${name} ${usage}`);
      channel.send(`Ну например ${prefix}${name} Админ`);
    }
  }
};