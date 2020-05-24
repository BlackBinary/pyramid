const faker = require('faker');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const users = Array.from(Array(20), () => 0).map(() => ({
      id: uuidv4(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
