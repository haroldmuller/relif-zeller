const { Op } = require('sequelize');
const { db } = require('../models');

// Get all clients
const getClients = async ctx => {
  try {
    const clients = await db.Client.findAll({
      attributes: ['id', 'name', 'rut'],
    });
    ctx.body = clients;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch clients' };
  }
};

// Create a new client and the associated messages and debts
const createClient = async ctx => {
  const {
    name,
    rut,
    messages,
    debts,
  } = ctx.request.body;

  if (!name || !rut) {
    ctx.status = 400;
    ctx.body = { error: 'Name and RUT are required' };
    return;
  }

  try {
    const client = await db.Client.create(
      {
        name,
        rut,
        messages: messages || [],
        debts: debts || [],
      },
      {
        include: [
          { model: db.Message, as: 'messages' },
          { model: db.Debt, as: 'debts' },
        ],
      }
    );
    ctx.body = client;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to create client' };
  }
};

// Get a client by ID. It includes the messages and debts associated with the client
const getClient = async ctx => {
  try {
    const client = await db.Client.findByPk(ctx.params.id, {
      attributes: ['id', 'name', 'rut'],
      include: [
        {
          model: db.Message,
          as: 'messages',
          attributes: ['id', 'text', 'sentAt', 'role'],
        },
        {
          model: db.Debt,
          as: 'debts',
          attributes: ['id', 'amount', 'institution', 'dueDate'],
        },
      ],
      order: [[{ model: db.Message, as: 'messages' }, 'sentAt', 'DESC']],
  });
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

// Get clients that haven't been contacted in the last 7 days
const getClientsToFollowUp = async ctx => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const clients = await db.Client.findAll({
      attributes: ['id', 'name', 'rut'],
      include: [
        {
          model: db.Message,
          as: 'messages',
          attributes: [],
          where: {
            sentAt: {
              [Op.lt]: sevenDaysAgo,
            }
          },
        },
      ],
    });
    
    ctx.body = clients;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch clients' };
  }
};

module.exports = {
  getClients,
  createClient,
  getClient,
  getClientsToFollowUp,
};
