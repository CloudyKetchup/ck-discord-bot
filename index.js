const fs      = require('fs');
const Discord = require('discord.js');
const dotenv  = require("dotenv");

const { token, prefix } = require('./config.json');

dotenv.config();

const client    = new Discord.Client();
client.commands = new Discord.Collection();

const checkRestrict = async message =>
{
	const { RestrictedWord } = require("./models/word.restricted");
  const Sequelize = require('sequelize');
  const words     = message.content.trim().split(" ");

  const restrited = await Promise.all(words.map(async word =>
  {
    try
    {
      const restricted = await RestrictedWord.findOne({
        where: {
					guildId: message.guild.id,
          name: {
            [Sequelize.Op.like]: word.replace(/[^a-zA-Z ]/g, "")
          }
        }
      });

      if (restricted)
      {
        message.delete();
        return true;
      }
		} catch (e)
		{
			console.log(e);
		}
  }));

  return restrited.some(r => r);
};

const handleTextMessage = async message =>
{
  await checkRestrict(message);
};

const commandAllowed = async (command, message) =>
{
  switch (true)
  {
    case !command:
    case command.suspended:
      return { valid: false };
    case command.adminOnly:
      const { hasAdminRole } = require("./services/client");
      const { member, channel } = message;

      const admin = await hasAdminRole(member, channel.guild.name);

      if (!admin) { return { mess: "not admin", valid: false }; }
    default: return { valid: true };
  };
}

const handleCommandMessage = async message =>
{
  const words = message.content.slice(prefix.length).split(/\<(.*?)\>/);
  const args  = words.filter(word => word.trim().length !== 0);
  const commandName = words[0].trim();

  args.shift(); //remove command name from arguments

  try
  {
    const command = client.commands.get(commandName);

    const { valid } = await commandAllowed(command, message);

    if (!valid) { return; }

    if (command.args && !args.length)
    {
      message.channel.send('а где параметры команды?');

      if (command.usage)
      {
        message.channel.send(`${prefix}${command.name} и ${command.usage}`);
      }
    } else
    {
      await command.execute(message, args);
    }
  } catch (e)
  {
    console.log(e)
    const ketchup = (await message.guild.members.fetch())
      .array()
      .filter(member => member.user.username === "CloudyKetchup")

    message.channel.send(`я упал, дайте по жопе ${ketchup}`);
  }
};

const onMessage = async message =>
{
  if (!message.author.bot)
  {
    await message.content.startsWith(prefix)
      ?
      handleCommandMessage(message)
      :
      handleTextMessage(message);
  }
};

// assign all commands to client
fs.readdirSync('./commands')
  .filter(file => file.endsWith('.js'))
  .forEach(file =>
  {
    const command = require(`./commands/${file}`);

    console.log("--> ✅ " + command.name);
    client.commands.set(command.name, command);
  });

// sync all models
fs.readdirSync("./models")
  .filter(file => file.endsWith(".js"))
  .forEach(file =>
  {
    const { model } = require(`./models/${file}`);

    model.sync();
  });

client.on('ready', async () =>
{
  client.user.setActivity("お前は何を見ていますか？");

  const { initClipsSchedulersAll } = require("./services/twitch");

  await initClipsSchedulersAll();

  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', onMessage);

client.login(token);

module.exports = { client };
