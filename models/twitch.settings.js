const { sequelize } = require("../sequelize");
const { DataTypes } = require("sequelize");

const TwitchSettings = sequelize.define("TwitchSettings", {
  guildId: {
    type: DataTypes.STRING,
    unique: true
  },
  clipsScheduler: {
    type: DataTypes.BOOLEAN
  },
  clipsChannelId: {
    type: DataTypes.STRING,
    unique: true
  },
  broadcaster: {
    type: DataTypes.JSON
  }
});

module.exports = {
  TwitchSettings,
  model: TwitchSettings
};