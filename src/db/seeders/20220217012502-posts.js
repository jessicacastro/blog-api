'use strict';
const postFactory = require('../factories/postFactory');


module.exports = {
  async up (queryInterface, Sequelize) {
    const posts = postFactory(10);
    return await queryInterface.bulkInsert('posts', posts, {});
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('posts', null, {});
  }
};
