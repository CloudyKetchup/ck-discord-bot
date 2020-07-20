const { ServerSettings } = require("../models/server.settings");

const validateAdmin = (msg, admin) =>
{
  const roleExist = msg.channel.guild.roles.cache.some(r => r.name === admin);

  return roleExist;
};

const validateArgs = async (msg, admin) =>
{
  if (!admin) return { error: "А где админ?" };

  const adminValid = validateAdmin(msg, admin);

  if (!adminValid)
  {
    return {
      error: `Роли '${admin}' не сушествует`
    };
  }
  return { error: null };
};

const settingsExist = async guildId =>
{
  const count = await ServerSettings.count({ where: { guildId: guildId }});

  if (count !== 0)
  {
    return true;
  }
  return false;
};

module.exports = {
  validateArgs,
  name: "server--setup",
  description: "Setup server",
  args: true,
  usage: `<adminRole>`,
  async execute(msg, args)
  {
    const { channel } = msg;
    const adminRole = args[0];

    if (await settingsExist(channel.guild.id))
    {
      const { prefix } = require("../config.json");
      const { name } = require("./server.settings.drop");

      channel.send(`Настройки для сервера уже присутвуют, для сброса -> ${prefix}${name}`);
      channel.send(":warning: Но будьте уверены что делайте!")
      return;
    }

    channel.send("Работаю...");

    const { guild } = channel;
    const { error } = await validateArgs(msg, adminRole);

    if (error)
    {
      channel.send(error);
      channel.send(this.usage);
      return;
    }

    try
    {
      const settings = await ServerSettings.create({
        guildId: channel.guild.id,
        name: guild.name,
        adminRole: adminRole
      });

      settings ? channel.send("Настройки сохранены :ok_hand:") : channel.send("Пройзошла ошибка");
    } catch (e)
    {
      channel.send("Пройзошла ошибка :anger:");
    }
  }
};