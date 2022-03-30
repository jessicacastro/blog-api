const { postFactory } = require('../../../src/db/factories')
const { Post } = require('../../../src/app/models')
const truncate = require('../../utils/truncate')

describe('Post Model integration', () => {
    beforeEach(async () => {
        await truncate()
    })

    it('create', async () => {        
        const postFaker = postFactory();

        const post = await Post.create(postFaker);
        expect(post).not.toBeNull();
        expect(post.id).toBeDefined();
        expect(post.title).toBe(postFaker.title);
        expect(post.description).toBe(postFaker.description);
    })

    it('deveria criar um post sem descrição.', async () => {        
        const postFaker = postFactory({'description': null});

        const post = await Post.create(postFaker);
        expect(post.description).toBeNull();
    })

    it('list', async () => { 
        await truncate();       
        const postFaker = postFactory();

        await Post.create(postFaker);
        const posts = await Post.findAll();

        expect(posts).not.toBeNull();
        expect(posts).toHaveLength(1);
    })

    it('show', async () => {
        await truncate();
        const postFaker = postFactory();

        const post = await Post.create(postFaker);
        const postFound = await Post.findByPk(post.id);

        expect(postFound).not.toBeNull();
        expect(postFound.id).toBe(post.id);
        expect(postFound.title).toBe(post.title);
        expect(postFound.description).toBe(post.description);        
    })

    it('update', async () => {
        await truncate();
        const postFaker = postFactory();

        const post = await Post.create(postFaker);
        const postFound = await Post.findByPk(post.id);

        postFound.title = 'Novo titulo';
        postFound.description = 'Nova descrição';

        await postFound.save();

        const postUpdated = await Post.findByPk(post.id);

        expect(postUpdated).not.toBeNull();
        expect(postUpdated.id).toBe(post.id);
        expect(postUpdated.title).toBe('Novo titulo');
        expect(postUpdated.description).toBe('Nova descrição');
    })

    it('delete', async () => {
        await truncate();
        const postFaker = postFactory();

        const post = await Post.create(postFaker);
        const postFound = await Post.findByPk(post.id);

        await postFound.destroy();

        const postDeleted = await Post.findByPk(post.id);

        expect(postDeleted).toBeNull();
    })
}) 