const fetch = require("node-fetch");

/**
 * Get twitch oauth2 token
 * 
 * @returns access token
 */
const getToken = async () =>
{
  const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = require("../config.json");

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
  const response = await fetch(`https://api.twitch.tv/helix/users?login=${login}`, {
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

  const URL = `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&started_at=${formatted}`;

  const response = await fetch(URL, {
    headers: {
      "Client-ID": clientId,
      "Authorization": `Bearer ${token}` 
    }
  })

  return (await response.json()).data.slice(0, limit);
};

module.exports = { getToken, getBroadcaster, getWeekClips };