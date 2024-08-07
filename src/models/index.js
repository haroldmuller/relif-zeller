const { sequelize, createDatabaseIfNotExists } = require('../config/database');
const Sequelize = require('sequelize');

const Client = require('./client')(sequelize, Sequelize.DataTypes);
// const Debt = require('./debt')(sequelize, Sequelize.DataTypes);
// const Message = require('./message')(sequelize, Sequelize.DataTypes);

const db = {
  Client,
  // Debt,
  // Message,
  sequelize,
  Sequelize,
};

// Synchronize all models with the database
async function initializeDatabase() {
  await createDatabaseIfNotExists();
  await sequelize.sync();
}

module.exports = { db, initializeDatabase };