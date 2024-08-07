const { sequelize, createDatabaseIfNotExists } = require('../config/database');
const Sequelize = require('sequelize');

const Client = require('./client')(sequelize, Sequelize.DataTypes);
const Debt = require('./debt')(sequelize, Sequelize.DataTypes);
const Message = require('./message')(sequelize, Sequelize.DataTypes);

const db = {
  Client,
  Debt,
  Message,
  sequelize,
  Sequelize,
};

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Synchronize all models with the database
async function initializeDatabase() {
  await createDatabaseIfNotExists();
  try {
    await sequelize.sync();
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
}

module.exports = { db, initializeDatabase };