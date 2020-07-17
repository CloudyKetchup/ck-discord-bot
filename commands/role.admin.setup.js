const { ServerSettings } = require("../models/server.settings");

module.exports = {
  name: "admin--set",
  description: "Setup server admin role",
  args: true,
  usage: "<adminRole>",
  async execute(msg, args)
  {
    const { channel, member } = msg;
    const serverSettings = await ServerSettings.findOne({ where: { name: channel.guild.name } });

    if (serverSettings && member.roles.cache.some(r => r.name === serverSettings.adminRole))
    {
      const newRole   = args[0];
      const roleExist = channel.guild.roles.cache.some(r => r.name === newRole);

      if (!roleExist)
      {
        channel,send(`Роль '${newRole}' не сушествует`);
        return;
      }
      const updateCount = await ServerSettings.update({ adminRole: newRole }, { where: { id: serverSettings.id } });

      updateCount[0] === 1 ? channel.send(`Роли админа обновлена на '${newRole}'`) : channel.send("Пройзоша ошибка");
    }
  }
};