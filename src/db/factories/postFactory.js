const { faker } = require('@faker-js/faker');

module.exports = () => {
    return {
        title: faker.hacker.phrase(),
        description: faker.lorem.paragraphs(),
        createdAt: faker.date.past()
    }
}