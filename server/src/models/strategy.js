
module.exports = (sequelize, DataTypes) => {
  const Strategy = sequelize.define('Strategy', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.UUID,
    options: DataTypes.JSONB,
  }, {});

  Strategy.associate = (models) => {
    Strategy.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    // Strategy.hasMany(models.Indicators, {
    //   foreignKey: 'strategyId',
    // });
  };

  return Strategy;
};
