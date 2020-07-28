const { client } = require("../index");

const getGuild = guildId =>
{
  return client.guilds.cache.get(guildId);
};

const getChannel = (guildId, channelId) =>
{
  const guild = getGuild(guildId);

  if (guild)
  {
    return guild.channels.cache.array().find(c => c.id === channelId);
  }
}

const getChannelByName = (guildId, channelName) =>
{
  const guild = getGuild(guildId);

  if (guild)
  {
    return guild.channels.cache.array().find(c => c.name === channelName);
  }
}

const hasAdminRole = async (author, guildName) =>
{
  const { ServerSettings } = require("../models/server.settings");

  const settings = await ServerSettings.findOne({
    where: {
      name: guildName
    }
  });

  if (settings)
  {
    const { adminRole } = settings;

    return author.roles.cache.some(role => role.name === adminRole);
  }
  return false;
};

module.exports = { getGuild, getChannel, getChannelByName, hasAdminRole };