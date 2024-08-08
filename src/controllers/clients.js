const { Op } = require('sequelize');
const { db } = require('../models');
const messageGeneratorService = require('../services/openai');

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
        attributes: ['id', 'name', 'rut'],
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

// Create a message from a client
const createClientMessage = async ctx => {
  const { text, sentAt, role } = ctx.request.body;
  const clientId = ctx.params.id;

  if (!text) {
    ctx.status = 400;
    ctx.body = { error: 'Text are required' };
    return;
  }

  try {
    const client = await db.Client.findByPk(clientId);
    if (!client) {
      ctx.status = 404;
      ctx.body = { error: 'Client not found' };
      return;
    }

    const message = await db.Message.create(
      {
        text,
        role,
        sentAt,
        clientId,
      },
      {
        attributes: ['id', 'text', 'sentAt', 'role', 'clientId'],
      }
    );

    ctx.body = message;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to create client message' };
  }
};

// Generate a message using OpenAI
const generateMessage = async ctx => {
  try {
    const clientId = ctx.params.id;
    
    let messages = [];

    const client = await db.Client.findByPk(clientId, {
      attributes: ['name'],
      include: [
        {
          model: db.Message,
          as: 'messages',
          attributes: ['role', 'text'],
        },
        {
          model: db.Debt,
          as: 'debts',
          attributes: ['amount', 'institution', 'dueDate'],
        },
      ],
    });

    messages.push({ role: 'system', content: `El nombre del usuario es ${client.name}` });

    client.messages.forEach(message => {
      messages.push({
        role: message.role === 'client' ? 'user': 'system',
        content: message.text,
      });
    });
    client.debts.forEach(debt => {
      messages.push({
        role: 'user',
        content: `Tengo una deuda de $${debt.amount} en ${debt.institution} que vence el ${debt.dueDate}`,
      });
    });

    const message = await messageGeneratorService.generateMessage(messages);
    
    ctx.body = { message };
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to generate message' };
  }
};

module.exports = {
  getClients,
  createClient,
  getClient,
  getClientsToFollowUp,
  createClientMessage,
  generateMessage,
};
