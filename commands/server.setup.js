const { ServerSettings } = require("../models/server.settings");

module.exports = {
  name: "server--setup",
  description: "Setup server",
  args: true,
  usage: "<adminRole>",
  async execute(msg, args)
  {
    const admin = args[0];

    const { channel: { guild } } = msg;

    try
    {
      const settings = await ServerSettings.create({ name: guild.name, adminRole: admin });

      settings ? msg.channel.send("Настройки сохранены") : msg.channel.send("Пройзошла ошибка");
    } catch (e)
    {
      msg.channel.send("Пройзошла ошибка");
    }
  }
};