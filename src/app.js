require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const clientRoutes = require('./routes/clients');
const { db, initializeDatabase } = require('./models');

const app = new Koa();

app.use(bodyParser());

app.use(clientRoutes.routes()).use(clientRoutes.allowedMethods());

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized and models synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
})();
