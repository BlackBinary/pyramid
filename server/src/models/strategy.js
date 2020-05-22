
module.exports = (sequelize, DataTypes) => {
  const Strategy = sequelize.define('Strategy', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: DataTypes.STRING,
    type: DataTypes.INTEGER,
    description: DataTypes.STRING,
    userId: DataTypes.UUID,
  }, {});

  Strategy.associate = (models) => {
    Strategy.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };

  return Strategy;
};
