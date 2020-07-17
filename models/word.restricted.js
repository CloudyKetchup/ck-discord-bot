const { sequelize } = require("../sequelize");
const { Sequelize } = require("sequelize");

const RestrictedWord = sequelize.define("RestrictedWord", {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
});

module.exports = {
  RestrictedWord: RestrictedWord
};