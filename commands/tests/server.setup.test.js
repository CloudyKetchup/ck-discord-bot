const { validateArgs } = require("../server.setup");

const msg = {
  channel: {
    guild: {
      roles: {
        cache: [{ name: "Admin"}]
      }
    }
  }
}

test("shoul validate args", async () => {
  const adminRole = "Admin";
  const streamerLogin = "BigLongFatGun";

  const { admin, streamer } = await validateArgs(msg, adminRole, streamerLogin);

  expect(admin);
  expect(streamer);
});

test("should fail admin role", async () => {
  const adminRole = "king";
  const streamerLogin = "BigLongFatGun";

  const { error } = await validateArgs(msg, adminRole, streamerLogin);

  expect(error === `Роли ${adminRole} не сушествует`);
});

test("should fail streamer", async () => {
  const adminRole = "Admin";
  const streamerLogin = "382738127389127387128";

  const { error } = await validateArgs(msg, adminRole, streamerLogin);

  expect(error === `Стример '${streamerLogin}' не найден`);
});