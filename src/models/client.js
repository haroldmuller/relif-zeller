module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Client.associate = models => {
    Client.hasMany(models.Message, {
      foreignKey: 'clientId',
      as: 'messages',
    });

    Client.hasMany(models.Debt, {
      foreignKey: 'clientId',
      as: 'debts',
    });
  };

  return Client;
};
