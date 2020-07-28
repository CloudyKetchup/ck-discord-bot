const { sequelize } = require("../sequelize");
const { Sequelize } = require("sequelize");

const RestrictedWord = sequelize.define("RestrictedWord", {
	guildId: {
		type: Sequelize.STRING
	},
  name: {
    type: Sequelize.STRING
  }
});

module.exports = {
  RestrictedWord,
  model: RestrictedWord
};
