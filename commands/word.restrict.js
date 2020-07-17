const { RestrictedWord } = require("../models/word.restricted");
const { ServerSettings } = require("../models/server.settings");

const restrict = async word =>
{
  try
  {
    const save = await RestrictedWord.create({ name: word });

    return { word: save };
  } catch (e)
  {
    if (e.name === 'SequelizeUniqueConstraintError')
    {
      return { e: "Word already exist" };
    }
    return { e: "Error happened" };
  }
};

module.exports = {
  name: "restrict",
  description: "Add a word to restricted words list",
  args: true,
  usage: "<word>",
  async execute(msg, args)
  {
    const restrictWord = args[0];
    const { channel, member } = msg;
    const settings = await ServerSettings.findOne({ where: { name: channel.guild.name } });

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
      const { word, e } = await restrict(restrictWord);

      if (word)
      {
        channel.send(`'${word.name}' было добавлено в список запрещенных слов`);
      } else if (e === "Word already exist")
      {
        channel.send(`Слово ${restrictWord} уже сушествует в списке запрещенных слов`);
      } else
      {
        channel.send(`пройзошла ошибка`);
      }
    } else
    {
      channel.send(`эту команду могут использовать только люди с ролю '${adminRole}'`);
    }
  }
};