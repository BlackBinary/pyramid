const faker = require('faker');

module.exports = {
  up: async (queryInterface) => {
    const users = Array.from(Array(20), () => 0).map(() => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      prefix: faker.name.prefix(),
      email: faker.internet.email(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
