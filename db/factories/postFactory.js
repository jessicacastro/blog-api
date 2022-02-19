const faker = require('@faker-js/faker/locale/pt_BR');

function make() {
    const post =  {
        title: faker.hacker.phrase(),
        description: faker.lorem.paragraphs(),
        createdAt: faker.date.past()
    }

    return post;
}

const factory = (n) =>  {

    if (n == undefined || n == 1) {
        return make();
    }

    const elements = [];

    for (let i = 0; i < n; i++) {
        elements[i] = make();
    }

    return elements
}

module.exports = factory;