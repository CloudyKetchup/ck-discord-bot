const { RestrictedWord } = require("../models/word.restricted");

module.exports = {
  name: "restricted--list",
  description: "Print list of restricted words",
  args: false,
  usage: "ну например <limit 25>",
  async execute(msg, args)
  {
    switch (args)
    {
      case undefined:
      case args[0] !== "limit":
      case !args[1]:
        msg.channel.send("правильно будет 'limit <цифра>' например 'limit 25'");
        break;
      default:
        const limit = 15;

        const restricted = await RestrictedWord.findAll({ limit: parseInt(args[1]) || limit });

        if (restricted.length > 0)
          msg.channel.send(`Вот список:\n${restricted.map(word => ` ->  ${word.name}\n`).join("")}`);
        else
          msg.channel.send("Список пуст");
        break;
    }
  }
};