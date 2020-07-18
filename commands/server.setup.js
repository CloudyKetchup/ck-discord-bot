const { ServerSettings } = require("../models/server.settings");

const validateAdmin = (msg, admin) =>
{
  const roleExist = msg.channel.guild.roles.cache.some(r => r.name === admin);

  return roleExist;
};

const validateStreamer = async streamer =>
{
  const twitch = require("../services/twitch");
  const { TWITCH_CLIENT_ID } = require("../config.json");

  const token       = await twitch.getToken();
  const broadcaster = await twitch.getBroadcaster(streamer, TWITCH_CLIENT_ID, token);

  if (broadcaster && broadcaster.login.toUpperCase() === streamer.toUpperCase())
  {
    const { id, login, display_name } = broadcaster;

    return { data: { id: id, login: login, display_name: display_name } };
  }
  return { error: `Стример '${streamer}' не найден` };
};

const validateArgs = async (msg, admin, streamer) =>
{
  if (!admin) return { error: "А где админ?" };
  if (!streamer) return { error: "А где стример?" };

  const adminValid = validateAdmin(msg, admin);

  if (!adminValid)
  {
    return {
      error: `Роли '${admin}' не сушествует`
    };
  }
  const { data, error } = await validateStreamer(streamer);

  if (error)
  {
    return { error: error };
  }
  return { admin: admin, streamer: data };
};

module.exports = {
  validateArgs,
  name: "server--setup",
  description: "Setup server",
  args: true,
  usage: `<adminRole> <streamer>`,
  async execute(msg, args)
  {
    const { channel } = msg;

    channel.send("Работаю...");

    const { guild } = channel;
    const { admin, streamer, error } = await validateArgs(msg, args[0], args[1]);

    if (error)
    {
      channel.send(error);
      channel.send(this.usage);
      return;
    }

    try
    {
      const settings = await ServerSettings.create({ name: guild.name, adminRole: admin, streamer: streamer });

      settings ? channel.send("Настройки сохранены") : channel.send("Пройзошла ошибка");
    } catch (e)
    {
      channel.send("Пройзошла ошибка");
    }
  }
};