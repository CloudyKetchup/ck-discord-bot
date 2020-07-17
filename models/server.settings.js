const { sequelize } = require("../sequelize");
const { Sequelize } = require("sequelize");

const ServerSettings = sequelize.define("ServerSettings", {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  adminRole: { type: Sequelize.STRING }
});

module.exports = {
  ServerSettings: ServerSettings
};