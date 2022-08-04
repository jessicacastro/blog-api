const { faker } = require('@faker-js/faker');

module.exports = (quantity) => {
    const posts = [];
    for (let i = 0; i < quantity; i++) {
        const post =  {
            title: faker.hacker.phrase(),
            description: faker.lorem.paragraphs(),
            createdAt: faker.date.past()
        }
        posts.push(post);
    }

    return posts;
}