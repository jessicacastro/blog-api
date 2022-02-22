const { Post } = require('../../db/models')

const postController = {
    index: async (req, res) => {
        const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });

        return res.json(posts);
    },
    show: async (req, res) => {
        const { id } = req.params;
        const post = await Post.findByPk(id);

        if (post == null) { // se não for encontrado
            return res.status(404).json({ error: { message: "O post de id = " + id + " não foi encontrado." } });
        }

        return res.json(post);
    },
    store: async (req, res) => {
        const { title, description } = req.body;

        if (!description) {
            return res.status(400).json({ error: { message: "O atributo description não foi enviado." } })
        }

        if (!title) {
            return res.status(400).json({ error: { message: "O atributo title não foi enviado." } })
        }

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

        if (!description) {
            return res.status(400).json({ error: { message: "O atributo description não foi enviado." } })
        }

        if (!title) {
            return res.status(400).json({ error: { message: "O atributo title não foi enviado." } })
        }

        // buscamos um post no banco
        const post = await Post.findByPk(id);
        if (post == null) { // se não for encontrado
            return res.status(404).json({ error: { message: "O post de id = " + id + " não foi encontrado." } });
        }
        //alteramos o valor original pelo que foi passado pelo request
        post.set({ title, description });
        // salvamos a nossa alteração
        await post.save()

        return res.json(post)

    },
    delete: async (req, res) => {
        const { id } = req.params;

        const post = await Post.findByPk(id);

        if (post == null) { // se não for encontrado
            return res.status(404).json({ error: { message: "O post de id = " + id + " não foi encontrado." } });
        }

        await Post.destroy({ where: { id } });

        return res.status(204).json();
    }
}

module.exports = postController;