const { sequelize } = require("../sequelize");
const { DataTypes } = require("sequelize");

const ServerSettings = sequelize.define("ServerSettings", {
  guildId: {
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    type: DataTypes.STRING
  },
  adminRole: { type: DataTypes.STRING },
  twitchModeratorRole: { type: DataTypes.STRING }
});

module.exports = {
  ServerSettings,
  model: ServerSettings
};