const { TwitchSettings } = require("../models/twitch.settings");

const name = "twitch--settings--drop"
const description = "Drop settings related to twitch";
const adminOnly = true;

const execute = async (msg, _args) =>
{
  const { channel } = msg;
  const guildId = channel.guild.id;

  const deletedCount = await TwitchSettings.destroy({
    where: {
      guildId: guildId
    }
  });

  if (deletedCount === 1)
  {
    const { destroyClipsJob } = require("../services/twitch");

    destroyClipsJob(guildId);

    channel.send("Настройки твич были сброшeны :ok_hand:");
  } else
  {
    channel.send("Пройзошла ошибка");
  }
}

module.exports = {
  name,
  description,
  adminOnly,
  execute
};