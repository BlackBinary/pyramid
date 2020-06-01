
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Indicators', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    strategyId: {
      type: Sequelize.UUID,
    },
    type: {
      type: Sequelize.STRING,
    },
    signal: {
      type: Sequelize.STRING,
    },
    params: {
      type: Sequelize.JSONB,
    },
    chartPeriod: {
      type: Sequelize.STRING,
    },
    required: {
      type: Sequelize.BOOLEAN,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Indicators'),
};
