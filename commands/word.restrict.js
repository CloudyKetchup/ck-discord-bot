const { RestrictedWord } = require("../models/word.restricted");

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

    if (member.roles.cache.some(r => r.name === "Адмен"))
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
      channel.send("эту команду могут использовать только люди с ролю 'Адмен'");
    }
  }
};