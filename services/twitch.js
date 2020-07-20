const fetch = require("node-fetch");

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = require("../config.json");
const { TwitchSettings } = require("../models/twitch.settings");

const clipsSchedulerJobs  = [];
const TWITCH_API          = "https://api.twitch.tv/helix";

/**
 * Get twitch oauth2 token
 * 
 * @returns access token
 */
const getToken = async () =>
{
  const URL = "https://id.twitch.tv/oauth2/token";
  const resposne = await fetch(`${URL}?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
    method: "POST"
  });

  return (await resposne.json()).access_token;
};

/**
 * Get broadcaster data
 * 
 * @param login     twitch streamer name
 * @param clientId  registered twitch application client id
 * @param token     oauth2 token
 * 
 * @returns broadcaster data json
 *  */
const getBroadcaster = async (login, clientId, token) =>
{
  const response = await fetch(`${TWITCH_API}/users?login=${login}`, {
    headers: {
      "Client-ID": clientId,
      "Authorization": `Bearer ${token}` 
    }
  });
  const broadcaster = await response.json();

  return broadcaster?.data[0];
};

/**
 * Get top clips from last week
 * 
 * @param broadcaster_id    id of twitch streamer
 * @param clientId          registered twitch application client id
 * @param token             oauth2 token
 * @param limit             clips count, default is 5
 * 
 * @returns list of clips
 */
const getWeekClips = async (broadcasterId, clientId, token, limit = 5) =>
{
  const date      = new Date(new Date().setDate(new Date().getDate() - 6)); // a week ago
  const rfc3339   = date.toISOString();
  const formatted = rfc3339.substring(0, rfc3339.indexOf(".")) + "Z";       // formatted date to rfc3339

  const URL = `${TWITCH_API}/clips?broadcaster_id=${broadcasterId}&started_at=${formatted}`;

  const response = await fetch(URL, {
    headers: {
      "Client-ID": clientId,
      "Authorization": `Bearer ${token}` 
    }
  })

  return (await response.json()).data.slice(0, limit);
};

/**
 * Scheduler sending top clips of the week to selected channel,
 * requires @alias TwitchSettings
 * 
 * @param settings  twitch settings
 */
const createClipsJob = settings =>
{
  if (!settings.clipsScheduler)
  {
    return;
  }

  const { client }  = require("../index");
  const cron        = require("node-cron");
  const { clipsChannelId, guildId } = settings;

  // fetch channel from guild
  const channel = client.channels.cache.array().find(channel => channel.id === clipsChannelId);

  // if channel found and job not already present
  if (channel && !clipsSchedulerJobs.some(job => job.id === guildId))
  {
    const job = cron.schedule("0 8 * * mon", async () => {
      const token       = await getToken();
      const broadcaster = await getBroadcaster(settings.broadcaster.login, TWITCH_CLIENT_ID, token);

      if (broadcaster)
      {
        const clips = await getWeekClips(broadcaster.id, TWITCH_CLIENT_ID, token);

        channel.send("Клипы за эту неделю:");
        clips.forEach(clip => channel.send(clip.url));
      }
    });

    // add to jobs list
    clipsSchedulerJobs.push({
      id: guildId,
      self: job
    });
  }
};

const destroyClipsJob = guildId =>
{
  const job = clipsSchedulerJobs.find(job => job.id === guildId);

  job && job.self.destroy();

  const index = clipsSchedulerJobs.findIndex(job => job.id === guildId);

  clipsSchedulerJobs.splice(index, 1);
};

/**
 * Init all scheduler jobs for guilds that have
 * scheduler on in twitch settings
 */
const initClipsSchedulersAll = async () =>
{
  const settings = await TwitchSettings.findAll();

  settings.filter(setting => setting.clipsScheduler)
    .forEach(createClipsJob);
};

/***
 * Get twitch broadcaster by name
 * 
 * @param broadcasterName   name
 * @return broadcaster or error message
 */
const getBroadcasterByName = async broadcasterName =>
{
  const token = await getToken();
  const broadcaster = await getBroadcaster(broadcasterName, TWITCH_CLIENT_ID, token);

  if (broadcaster && broadcaster.login.toUpperCase() === broadcasterName.toUpperCase())
  {
    return { broadcaster: broadcaster };
  }
  return { error: `Streamer not found` };
};

module.exports = {
  getToken,
  getBroadcaster,
  getWeekClips,
  createClipsJob,
  destroyClipsJob,
  initClipsSchedulersAll,
  getBroadcasterByName
};