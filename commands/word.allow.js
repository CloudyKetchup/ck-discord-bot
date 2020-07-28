const { RestrictedWord } = require("../models/word.restricted");
const { ServerSettings } = require("../models/server.settings");

const allow = async word =>
{
  const deletedCount = await RestrictedWord.destroy({ where: { name: word }});

  return { error: deletedCount !== 1 };
};

const exists = async word =>
{
  const record = await RestrictedWord.findOne({ where: { name: word } });

  return record !== null;
};

module.exports = {
  name: "allow",
  description: "Remove word from restricted list",
  args: true,
  usage: "<word>",
  async execute(msg, args)
  {
    const word = args[0];
    const { channel, member } = msg;

    const settings = await ServerSettings.findOne({
      where: {
        guildId: channel.guild.id,
        name: channel.guild.name
      }
    });

    if (!settings)
    {
      const setup = require("./server.setup");
      const { prefix } = require("../config.json");

      channel.send(`Сервер не настроен, настройте с помошью -> ${prefix}${setup.name}${setup.usage}`);
      return;
    }
    const adminRole = settings.adminRole;

    if (member.roles.cache.some(r => r.name === adminRole))
    {
      const exist = await exists(word);

      if (!exist)
      {
        channel.send(`'${word}' нету в списке запрещенных слов`);
      } else
      {
        const { error } = await allow(word);

        error ? channel.send("произошла ошибка") : channel.send(`слово '${word}' было разрешено`);
      }
    } else
    {
      channel.send(`эту команду могут использовать только люди с ролю '${adminRole}'`);
    }
  }
};