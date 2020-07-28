const { getWeekClips, getToken, getBroadcaster } = require("../twitch");

test("should fetch clips", async () => {
  const { TWITCH_CLIENT_ID } = require("../../config.json");

  const token       = await getToken();
  const broadcaster = await getBroadcaster("BigLongFatGun", TWITCH_CLIENT_ID, token);
  const clips       = await getWeekClips(broadcaster.id, TWITCH_CLIENT_ID, token);

  expect(clips);
});