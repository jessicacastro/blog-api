const request = require('supertest')
const app = require('../../../src/app');
const postFactory = require('../../../src/db/factories/postFactory')
const truncate = require('../../utils/truncate')

describe('Posts', () => {
    beforeEach(async () => {
        await truncate();
    });

    async function criaPost() {
        const postFaker = postFactory();

        const response = await request(app)
                            .post('/posts')
                            .send(postFaker);
        
        return response.body;
    } 


    it('deveria retornar um erro quanto tentarmos criar um post e não passarmos o dados que serão cadastrados no post', async () => {
        const response = await request(app)
            .post('/posts')
            .send({title: "titulo test"})

        expect(response.status).toBe(400); // BAD REQUEST - 400 
        expect(response.body).not.toBeNull();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBeDefined();
        expect(response.body.error.message).toBe("O atributo description não foi enviado.");


        const response2 = await request(app)
            .post('/posts')
            .send({description: "descrição test"})

        expect(response2.status).toBe(400);
        expect(response2.body).not.toBeNull();
        expect(response2.body.error).toBeDefined();
        expect(response2.body.error.message).toBeDefined();
        expect(response2.body.error.message).toBe("O atributo title não foi enviado.");

    });

    it('deveria cadastrar um post quando executar um POST em /posts', async () => {
        const postFaker = postFactory();

        const response = await request(app)
                            .post('/posts')
                            .send(postFaker);

        const post = response.body;
        expect(response.status).toBe(201);
        expect(post).not.toBeNull();
        expect(post.id).toBeDefined();
        expect(post.title).toBe(postFaker.title);
        expect(post.description).toBe(postFaker.description);
    });

    it('deveria retornar um erro quando tentarmos PEGAR um post com um id inválido', async () => {
        const fakeID = 20;

        const response = await request(app)
                            .get('/posts/' + fakeID)
                            .send();

        expect(response.status).toBe(404);
        expect(response.body).not.toBeNull();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBeDefined();
        expect(response.body.error.message).toBe("O post de id = " + fakeID + " não foi encontrado.");
    });

    it('deveria recuperar um post executando um GET em /posts/:id, sendo um post já cadastrado', async () => {
        const post = await criaPost();

        const response = await request(app)
                            .get('/posts/' + post.id)
                            .send()

        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
        expect(response.body.id).toBe(post.id);
    });

    it('deveria retornar um erro quando tentarmos atualizar um post com um id inválido', async () => {
        const postFaker = postFactory();

        const fakeID = 20;

        const response = await request(app)
                            .put('/posts/' + fakeID) // Lembrando que 3 é um id inválido, pq todos os posts foram deletados
                            .send(postFaker);

        expect(response.status).toBe(404);
        expect(response.body).not.toBeNull();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBeDefined();
        expect(response.body.error.message).toBe("O post de id = " + fakeID + " não foi encontrado.");
    });

    it('deveria retornar um erro quanto tentarmos atualizar um post cadastro e não passarmos o dados que serão atualizados', async () => {
        const post = await criaPost(); // cadastra o nosso post

        const response = await request(app)
            .put('/posts/' + post.id)
            .send({title: "titulo test"})

        expect(response.status).toBe(400);
        expect(response.body).not.toBeNull();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBeDefined();
        expect(response.body.error.message).toBe("O atributo description não foi enviado.");


        const response2 = await request(app)
            .put('/posts/' + post.id)
            .send({description: "descrição test"})

        expect(response2.status).toBe(400);
        expect(response2.body).not.toBeNull();
        expect(response2.body.error).toBeDefined();
        expect(response2.body.error.message).toBeDefined();
        expect(response2.body.error.message).toBe("O atributo title não foi enviado.");

    });

    it('deveria atualizar um post executando um PUT em /posts/:id, sendo um post já cadastrado', async () => {
        const post = await criaPost(); // antigo
        const postFaker = postFactory(); // novo

        const response = await request(app)
            .put('/posts/' + post.id)
            .send({title: postFaker.title, description: postFaker.description});
        
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
        expect(response.body.title).toBeDefined();
        expect(response.body.title).toBe(postFaker.title);
        expect(response.body.description).toBeDefined();
        expect(response.body.description).toBe(postFaker.description);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.createdAt).toBe(post.createdAt)

    });

    it('deveria retornar um erro quando tentarmos DELETAR um post com um id inválido', async () => {
        const fakeID = 1;

        const response = await request(app)
                            .delete('/posts/' + fakeID)
                            .send();

        expect(response.status).toBe(404);
        expect(response.body).not.toBeNull();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBeDefined();
        expect(response.body.error.message).toBe("O post de id = " + fakeID + " não foi encontrado.");
    });

    it('deveria deletar um post quando excutarmos um DELETE em /posts/:id, sendo um post já cadastrado', async () => {
        const post = await criaPost();

        const response = await request(app)
                            .delete('/posts/' + post.id)
                            .send();

        expect(response.status).toBe(204);

        const response2 = await request(app)
                            .get('/posts/' + post.id)
                            .send();

        expect(response2.status).toBe(404);
    });

    it('deveria retornar uma lista de post ordenada pela data de crição na ordem decrescente.', async () => {
        const posts = [];

        posts.push(await criaPost());
        posts.push(await criaPost());
        posts.push(await criaPost());


        // ordenação por data de forma decrescente
        posts.sort(function (postA, postB) {
            x = new Date(postA.createdAt)
            y = new Date(postB.createdAt)
            return y - x;
        });

        const response = await request(app)
            .get('/posts')
            .send()
        
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(posts.length);

        expect(response.body).toStrictEqual(posts)
    });

});