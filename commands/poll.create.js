const { pollEmbed, resultsEmbed } = require("../embeds/poll.embeds");

const name        = "poll";
const description = "Create a new poll";
const adminOnly   = true;
const args        = true;
const usage       = "<#channel> <question>";

/***
 * Get channel where to send poll
 * 
 * @param guild
 * @param pollChannelId   id of channel where to send poll
 */
const getPollChannel = (guild, pollChannelId) =>
{
  return guild 
    .channels
    .cache
    .find(channel => channel.id === pollChannelId)
};

/***
 * Format all sentences into one string pollQuestion
 * 
 * @Param messageFields     poll sentences
 * @return formated poll question
 */
const formatPollMessage = messageFields =>
{
  let pollQuestion = "";

  messageFields.map(field => field + "\n").forEach(field => pollQuestion += field);

  return pollQuestion;
};

const execute = async (msg, args) =>
{
  const { channel, author, member } = msg;
  const { guild }     = channel;
  const pollChannelId = args.shift(); // channel id where to send poll

  if (isNaN(pollChannelId))
  {
    const { prefix } = require("../config.json");

    channel.send(`Канал для голосования не верный`);
    return channel.send(`${prefix} ${name} ${usage}`);
  }
  const pollQuestion = formatPollMessage(args);
  // channel where to send poll
  const pollChannel  = getPollChannel(guild, pollChannelId);
  const embed        = pollEmbed(pollQuestion, author, member.displayHexColor);

  const message = await (pollChannel ? pollChannel.send(embed) : channel.send(embed));

  await message.react("👍")
  await message.react("👎");

  // delete poll command message after 5 seconds
  setTimeout(() => msg.delete(), 5000);
  // send poll resutls after 24 hours in the same poll channel
  setTimeout(() =>
  {
    const reactions = message.reactions.cache.array();
    const results = { agree: reactions[0].count - 1, disagree: reactions[1].count - 1 };

    const embed = resultsEmbed(pollQuestion, results, author, member.displayHexColor);

    pollChannel.send(embed);
  }, 86400000);
};

module.exports = {
  name,
  description,
  adminOnly,
  args,
  usage,
  execute
};