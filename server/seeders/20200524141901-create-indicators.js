// const path = require('path');
// const fs = require('fs');

// // const directoryPath = path.join(__dirname, 'Documents');

// const packageJson = require('@root/package.json');

// // TODO: This is a hack. Fix it
// // eslint-disable-next-line no-underscore-dangle
// const directoryPath = packageJson._moduleAliases['@indicators'];

// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     console.log('HI');
//     console.log(directoryPath);

//     // fs.readdir(directoryPath, (err, files) => {
//     //   // handling error
//     //   if (err) {
//     //     return console.log(`Unable to scan directory: ${err}`);
//     //   }
//     //   // listing all files using forEach
//     //   files.forEach((file) => {
//     //     // Do whatever you want to do with the file
//     //     console.log(file);
//     //   });
//     // });
//     /*
//       Add altering commands here.
//       Return a promise to correctly handle asynchronicity.

//       Example:
//       return queryInterface.bulkInsert('People', [{
//         name: 'John Doe',
//         isBetaMember: false
//       }], {});
//     */
//   },

//   down: (queryInterface, Sequelize) => {
//     /*
//       Add reverting commands here.
//       Return a promise to correctly handle asynchronicity.

//       Example:
//       return queryInterface.bulkDelete('People', null, {});
//     */
//   },
// };
