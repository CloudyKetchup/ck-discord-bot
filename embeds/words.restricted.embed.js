const Discord = require("discord.js");

const getEmbed = (words, color) =>
{
	let count = 1;
	let desc = "";
	const formatedWords = words.map(word => `${count++}. ${word.name}\n`);

	formatedWords.forEach(word => { desc = desc + word });

	const embed = new Discord.MessageEmbed()
		.setColor(color || "#fa4437")
		.setTitle("Список запрещенных слов")
		.setDescription(desc);

	return embed;
};

module.exports = { getEmbed };