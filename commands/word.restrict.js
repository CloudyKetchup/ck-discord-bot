const { RestrictedWord } = require("../models/word.restricted");
const { ServerSettings } = require("../models/server.settings");

const restrict = async (guildId, word) =>
{
  try
  {
    const save = await RestrictedWord.create({ guildId: guildId, name: word });

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
  adminOnly: true,
  args: true,
  usage: "<word>",
  async execute(msg, args)
  {
    const restrictWord = args[0];
    const { channel }  = msg;
    const settings = await ServerSettings.findOne({ where: { guildId: channel.guild.id }});

    if (!settings)
    {
      const setup = require("./server.setup");
      const { prefix } = require("../config.json");

      channel.send(`Сервер не настроен, настройте с помошью -> ${prefix}${setup.name}${setup.usage}`);
      return;
    }
		const { word, e } = await restrict(channel.guild.id, restrictWord);

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
  }
};
