const { sequelize } = require("../sequelize");
const { Sequelize, DataTypes } = require("sequelize");


const ServerSettings = sequelize.define("ServerSettings", {
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  adminRole: { type: DataTypes.STRING },
  streamer: { type: DataTypes.JSON }
});

module.exports = {
  ServerSettings: ServerSettings
};