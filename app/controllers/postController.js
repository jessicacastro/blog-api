const { Post } = require('../../db/models')

const postController = {
    index: async (req, res) => {
        const posts = await Post.findAll();

        return res.json(posts);
    },
    show: async (req, res) => {
        const { id } = req.params;
        const post = await Post.findByPk(id);

        return res.json(post);
    },
    store: async (req, res) => {
        const { title, description } = req.body;

        const post = await Post.create({
            title,
            description,
            createdAt: new Date()
        });

        return res.status(201).json(post);
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body;

        const post = await Post.findByPk(id);
        post.set({ title, description });
        await post.save();

        return res.json(post);
    },
    delete: async (req, res) => {
        const { id } = req.params;
        await Post.destroy({ where: { id } });

        return res.status(204).send()
    }
}

module.exports = postController;