const { TwitchSettings } = require("../models/twitch.settings");
const { prefix } = require("../config.json");

const name        = "twitch--weekly--clips";
const description = "Toggle scheduler for clips of the week highlights";
const adminOnly   = true;
const args        = true;
const usage       = "<status> (on/off)"

/**
 * Toggle weekly clips scheduler
 * 
 * @param settings    actual twitch settings
 */
const postExecute = settings =>
{
  const { createClipsJob, destroyClipsJob } = require("../services/twitch");

  if (settings.clipsScheduler)
  {
    createClipsJob(settings);
  } else
  {
    destroyClipsJob(settings.guildId);
  }
};

const execute = async (msg, args) =>
{
  const { channel } = msg;
  const arg         = args[0];

  // validate args
  if (!(arg === "on" || arg === "off"))
  {
    channel.send(`Неправильная опция, может быть 'on' либо 'off'\n ${prefix}${name} ${usage}`);
    return;
  }

  const settings = await TwitchSettings.findOne({
    where: {
      guildId: channel.guild.id
    }
  });

  if (settings)
  {
    // check if option already applied
    if (arg === "on" && settings.clipsScheduler)
    {
      channel.send("Функция рассылки клипов уже включена :white_check_mark:");
      return;
    } else if (arg === "off" && !settings.clipsScheduler)
    {
      channel.send("Функция рассылки клипов уже отключена :no_entry_sign:");
      return;
    }

    // update settings
    const updatedCount = await TwitchSettings.update({ clipsScheduler: arg === "on" }, { where: { guildId: channel.guild.id } });

    if (updatedCount[0] === 1)
    {
      // toggle clips scheduler
      settings.clipsScheduler = arg === "on";
      postExecute(settings);

      // send twitch settings embed
      const { getEmbed } = require("../embeds/twitch.embed");

      channel.send("Настройки обновлены :ok_hand:");
      channel.send(getEmbed(settings));
    } else
    {
      channel.send("Пройзошла ошибка :anger:");
    }
  } else
  {
    const { name, usage } = require("./twitch.setup");

    channel.send(`Твич не настроен, команда -> ${prefix}${name} ${usage}`);
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
