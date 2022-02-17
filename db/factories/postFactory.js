const faker = require('@faker-js/faker/locale/pt_BR');

function make() {
    return {
        title: faker.hacker.phrase(),
        description: faker.lorem.paragraphs(),
        createdAt: faker.date.past()
    }
}

module.exports = (n) => {

    if (n == 1) {
        return make();
    }

    const elements = [];

    for (let i = 0; i < n; i++) {
        elements[i] = make();
    }

    return elements
}
