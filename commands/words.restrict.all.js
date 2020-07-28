const { RestrictedWord } = require("../models/word.restricted");

module.exports = {
  name: "restricted--list",
  description: "Print list of restricted words",
  args: false,
  usage: "ну например <limit 25>",
  async execute(msg, args)
  {
		const { channel } = msg;
    switch (args)
    {
      case undefined:
      case args[0] !== "limit":
      case !args[1]:
        channel.send("правильно будет 'limit <цифра>' например 'limit 25'");
        break;
      default:
        const limit = 15;
        const restricted = await RestrictedWord.findAll({ limit: parseInt(args[1]) || limit });

        if (restricted.length > 0)
        {
          const { client } = require("../index");

          const bot = channel.guild
            .members
            .cache
            .array()
            .find(member => member.user.id === client.user.id);

          if (bot)
          {
            const { getEmbed } = require("../embeds/words.restricted.embed");

            channel.send(getEmbed(restricted, bot.displayHexColor))
          }
        }
        else
          channel.send("Список пуст");
        break;
    }
  }
};
