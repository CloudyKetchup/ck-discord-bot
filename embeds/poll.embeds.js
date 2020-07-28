const { MessageEmbed } = require("discord.js");

const pollEmbed = (description, author, color) =>
{
  const embed = new MessageEmbed()
    .setTitle(`ГолосAование \n${description}`)
    .setColor(color)
    .setAuthor(author.username, author.avatarURL())
    .setDescription()
    .setTimestamp();

  return embed;
};

const resultsEmbed = (pollQuestion, results, author, color) =>
{
  const embed = new MessageEmbed()
    .setTitle("Результаты голосования")
    .setColor(color)
    .setAuthor(author.username, author.avatarURL())
    .setDescription(pollQuestion)
    .addFields(
      {
        name: "Голосовали за:",
        value: `👍 ${results.agree} человек`
      },
      {
        name: "Голосовали против:",
        value: `👎 ${results.disagree} человек`
      }
    )
    .setTimestamp(new Date())
    .setFooter("Спасибо всем за участие")
  return embed;
};

module.exports = { pollEmbed, resultsEmbed };