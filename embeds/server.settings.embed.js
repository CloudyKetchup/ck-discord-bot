const Discord = require("discord.js");

const getEmbed = (guild, settings, color = "#fa4437") =>
{
	const embed = new Discord.MessageEmbed()
		.setColor(color)
		.setTitle("Настройки сервера")
		.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
		.addFields(
			{
				name: "Роль админа",
				value: settings.adminRole
			},
			{
				name: "Роль твич модератора",
				value: settings.twitchModeratorRole
			}
		);

	return embed;
};

module.exports = { getEmbed };