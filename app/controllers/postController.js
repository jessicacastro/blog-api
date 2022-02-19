const { Post } = require('../../db/models')

const postController = {
    index: async (req, res) => {
        const posts = await Post.findAll({ order: [['title', 'ASC']] });

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

        // buscamos um post no banco
        const post = await Post.findByPk(id);
        //alteramos o valor original pelo que foi passado pelo request
        post.set({ title, description });
        // salvamos a nossa alteração
        await post.save()

        // await Post.update({title, description}, { where: { id }})

        return res.json(post)

    },
    delete: async (req, res) => {
        const { id } = req.params;
        await Post.destroy({ where: { id } });

        return res.status(204).json();
    }
}

module.exports = postController;