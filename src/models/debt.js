module.exports = (sequelize, DataTypes) => {
  const Debt = sequelize.define('Debt', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Clients',
        key: 'id',
      },
      allowNull: false,
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Debt.associate = (models) => {
    Debt.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
    });
  };

  return Debt;
}
