module.exports = (sequelize, DataTypes) => {
  const Indicator = sequelize.define('Indicator', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    strategyId: DataTypes.UUID,
    type: DataTypes.STRING,
    signal: DataTypes.STRING,
    params: DataTypes.JSONB,
    chartPeriod: DataTypes.STRING,
    required: DataTypes.BOOLEAN,
  }, {});

  Indicator.associate = (models) => {
    Indicator.belongsTo(models.Strategy, {
      foreignKey: 'strategyId',
    });
  };

  return Indicator;
};
