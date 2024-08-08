const { Sequelize } = require('sequelize');
const { Client } = require('pg');

const DB_NAME = process.env.DB_NAME || 'relif_zeller_dev';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'password';
const DB_HOST = process.env.DB_HOST || 'localhost';

// Create a new Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
});

// Create the database if it doesn't exist
async function createDatabaseIfNotExists() {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASS,
    database: 'postgres'
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${DB_NAME}`);
    }
  } finally {
    await client.end();
  }
}

module.exports = { sequelize, createDatabaseIfNotExists };