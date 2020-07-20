const { TwitchSettings } = require("../models/twitch.settings");
const { getBroadcasterByName } = require("../services/twitch");
const { prefix } = require("../config.json");

const name        = "twitch--setup";
const description = "Setup twitch related features";
const adminOnly   = true;
const args        = true;
const usage       = "<broadcaster> <highlightsChannel>";

const fetchSettings = async guildId =>
{
  const twitchSettings = await TwitchSettings.findOne({
    where: {
      guildId: guildId
    }
  });

  return twitchSettings;
};

const getDataFromArgs = async (guildId, broadcasterName, highlightsChannel) =>
{
  const errMessage = `${prefix}${name} ${usage}`;

  if (!broadcasterName.length) return { error: `Имя стримера отсутствует\n ${errMessage}` };
  if (!highlightsChannel) return { error: `Канал для ярких моментов отсутсвует\n ${errMessage}` };

  const { broadcaster, error } = await getBroadcasterByName(broadcasterName);

  if (error)
  {
    return { error: `Стример '${broadcasterName}' не найден` };
  }

  const { getChannelByName } = require("../services/client");

  const channel = getChannelByName(guildId, highlightsChannel);

  if (!channel)
  {
    return { error: `Канал '${highlightsChannel}' не найден на сервере` };
  }

  return { broadcaster: broadcaster, clipsChannel: channel };
};

const execute = async (msg, args) =>
{
  const { channel } = msg;
  const guildId = channel.guild.id;

  channel.send("Работаю...");

  if (await fetchSettings(guildId))
  {
    const { name } = require("./twitch.settings.drop");

    channel.send(`Настройки твич уже присутвуют, Чтобы сбросить -> ${prefix}${name}`);
    channel.send(":warning: Но будьте уверены что делайте!");
  } else
  {
    const { broadcaster, clipsChannel, error } = await getDataFromArgs(guildId, args[0], args[1]);

    if (error)
    {
      channel.send(error);
      return;
    }

    const settings = await TwitchSettings.create({
      guildId: guildId,
      clipsScheduler: true,
      clipsChannelId: clipsChannel.id,
      broadcaster: broadcaster
    });

    if (settings)
    {
      const { createClipsJob } = require("../services/twitch");

      createClipsJob(settings);
    }
    channel.send(settings ? "Твич настроен :ok_hand:" : "Пройзошла ошибка :anger:");
  }
};

module.exports = {
  name,
  description,
  adminOnly,
  args,
  usage,
  execute
};