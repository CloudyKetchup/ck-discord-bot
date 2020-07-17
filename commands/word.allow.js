const { RestrictedWord } = require("../models/word.restricted");

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

    if (member.roles.cache.some(r => r.name === "Адмен"))
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
      channel.send("эту команду могут использовать только люди с ролю 'Адмен'");
    }
  }
};