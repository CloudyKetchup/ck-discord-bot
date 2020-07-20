const Discord = require("discord.js");

const getEmbed = settings => new Discord.MessageEmbed()
  .setColor("#9048ff")
  .setTitle("Настройки твич")
  .setAuthor("Twitch.tv", "https://cdn0.iconfinder.com/data/icons/social-network-7/50/16-512.png")
  .addFields(
    { name: "Канал", value: settings.broadcaster.display_name },
    {
      name: "Рассылка топ 5 клипов за неделю",
      value: settings.clipsScheduler ? ":white_check_mark: включена" : ":no_entry_sign: отключена "
    },
  )

module.exports = { getEmbed };