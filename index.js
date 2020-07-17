const fs      = require('fs');
const Discord = require('discord.js');
const dotenv  = require("dotenv");

const { token, prefix }   = require('./config.json');
const { RestrictedWord }  = require('./models/word.restricted');

dotenv.config();

const client    = new Discord.Client();
client.commands = new Discord.Collection();

const checkRestrict = async message =>
{
  const Sequelize = require('sequelize');
  const words     = message.content.trim().split(" ");

  const restrited = await Promise.all(words.map(async word =>
  {
    try
    {
      const restricted = await RestrictedWord.findOne({
        where: {
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
    } catch (e) {}
  }));

  return restrited;
};

const handleTextMessage = async message =>
{
};

const handleCommandMessage = async message =>
{
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  try
  {
    const command = client.commands.get(commandName);

    if (command.args && !args.length)
    {
      message.channel.send('а где параметры команды?');

      if (command.usage)
      {
        message.channel.send(`${prefix}${command.name} и ${command.usage}`);
      }
    } else
    {
      command ? await command.execute(message, args) : message.channel.send("такой команды нету");
    }
  } catch (e)
  {
    const ketchup = (await message.guild.members.fetch())
      .array()
      .filter(member => member.user.username === "CloudyKetchup")

    message.channel.send(`я упал, дайте по жопе ${ketchup}`);
  }
};

const onMessage = async message =>
{
  if (!message.author.bot && !(await checkRestrict(message)).some(r => r))
  {
    await message.content.startsWith(prefix)
      ?
      handleCommandMessage(message)
      :
      handleTextMessage(message);
  }
};

fs.readdirSync('./commands')
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
  });

client.on('ready', () =>
{
  RestrictedWord.sync();
	client.user.setActivity("お前は何を見ていますか？");
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', onMessage);

client.login(token);