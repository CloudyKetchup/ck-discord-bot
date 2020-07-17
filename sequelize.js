const Sequelize = require('sequelize');

const {
  DB_HOSTNAME,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD
} = process.env

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOSTNAME,
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite"
})

module.exports = { sequelize: sequelize };