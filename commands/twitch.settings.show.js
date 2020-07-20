const { TwitchSettings } = require("../models/twitch.settings");

const name = "twitch--settings--show";
const description = "Show twitch settings";
const adminOnly = true;

const execute = async (msg, _args) =>
{
  const { channel } = msg;

  const settings = await TwitchSettings.findOne({
    where: {
      guildId: channel.guild.id
    }
  });

  if (settings)
  {
    const { getEmbed } = require("../embeds/twitch.embed");

    const embed = getEmbed(settings)

    channel.send(embed);
  } else
  {
    const { prefix } = require("../config.json");
    const { name, usage } = require("./twitch.setup");

    channel.send(`Твич не настроен, команда -> ${prefix}${name} ${usage}`);
  }
};

module.exports = {
  name,
  description,
  adminOnly,
  execute
};