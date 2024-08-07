const db = require('../models');

const getClients = async ctx => {
  try {
    const clients = await db.Client.findAll();
    ctx.body = clients;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch clients' };
  }
};

const createClient = async ctx => {
  const { name, rut } = ctx.request.body;

  if (!name || !rut) {
    ctx.status = 400;
    ctx.body = { error: 'Name and RUT are required' };
    return;
  }

  try {
    const client = await db.Client.create({ name, rut });
    ctx.body = client;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to create client' };
  }
};

const getClient = async ctx => {
  try {
    const client = await db.Client.findByPk(ctx.params.id);
    if (client) {
      ctx.body = client;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Client not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch client' };
  }
};

module.exports = {
  getClients,
  createClient,
  getClient,
};