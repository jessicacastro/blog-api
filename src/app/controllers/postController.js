const { Post } = require('../models')

const postController = {

    index: async (req, res) => {
        /*
            #swagger.description = 'Listagem de posts.'
            #swagger.tags = ['Posts']
            #swagger.summary = 'Listagem de posts.'
        */

        const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });

        /* #swagger.responses[200] = { schema: { "$ref": "#/definitions/Posts" } } */
        return res.json(posts);
    },
    show: async (req, res) => {
        /*
            #swagger.description = 'Consulta de post.'
            #swagger.tags = ['Posts']
            #swagger.summary = 'Consulta de post.'
        */

        /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'Post ID.',
                required: true
            }
        */
        const { id } = req.params;
        const post = await Post.findByPk(id);

        if (post == null) { // se não for encontrado
            // #swagger.responses[404] = { description: "O post de id = X não foi encontrado." }
            return res.status(404).json({ error: { message: "O post de id = " + id + " não foi encontrado." } });
        }

        /* #swagger.responses[200] = { schema: { "$ref": "#/definitions/Post" } } */
        return res.json(post);
    },
    store: async (req, res) => {
        /*
            #swagger.description = 'Cadastra post.'
            #swagger.summary = 'Cadastra post.'
            #swagger.tags = ['Posts']
        */
        const { title, description } = req.body;

        if (!description) {
            /* #swagger.responses[400] = { description: "O atributo description não foi enviado." } */
            return res.status(400).json({ error: { message: "O atributo description não foi enviado." } })
        }

        if (!title) {
            /* #swagger.responses[400] = { description: "O atributo title não foi enviado." } */
            return res.status(400).json({ error: { message: "O atributo title não foi enviado." } })
        }

        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Post information.',
                required: true,
                schema: { $ref: "#/definitions/AddPost" }
        } */
        const post = await Post.create({
            title,
            description,
            createdAt: new Date()
        });

        /* #swagger.responses[201] = { schema: { "$ref": "#/definitions/Post" } } */
        return res.status(201).json(post);
    },
    update: async (req, res) => {
        /*
            #swagger.description = 'Atualiza post.'
            #swagger.summary = 'Atualiza post.'
            #swagger.tags = ['Posts']
        */

        /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'Post ID.',
                required: true
            }
        */
        const { id } = req.params;
        const { title, description } = req.body;

        if (!description) {
            /* #swagger.responses[400] = { description: "O atributo description não foi enviado." } */
            return res.status(400).json({ error: { message: "O atributo description não foi enviado." } })
        }

        if (!title) {
            /* #swagger.responses[400] = { description: "O atributo title não foi enviado." } */
            return res.status(400).json({ error: { message: "O atributo title não foi enviado." } })
        }

        const post = await Post.findByPk(id);
        if (post == null) {
            // #swagger.responses[404] = { description: "O post de id = X não foi encontrado." }
            return res.status(404).json({ error: { message: "O post de id = " + id + " não foi encontrado." } });
        }

        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Post information.',
                required: true,
                schema: { $ref: "#/definitions/AddPost" }
        } */
        post.set({ title, description });

        await post.save()

        /* #swagger.responses[200] = { schema: { "$ref": "#/definitions/Post" } } */
        return res.json(post)

    },
    delete: async (req, res) => {
        /*
            #swagger.description = 'Deleta post.'
            #swagger.summary = 'Deleta post.'
            #swagger.tags = ['Posts']
        */

        /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'Post ID.',
                required: true
            }
        */
        const { id } = req.params;

        const post = await Post.findByPk(id);

        if (post == null) {
            // #swagger.responses[404] = { description: "O post de id = X não foi encontrado." }
            return res.status(404).json({ error: { message: "O post de id = " + id + " não foi encontrado." } });
        }

        await Post.destroy({ where: { id } });

        /* #swagger.responses[204] = { description: "Deletado com sucesso." } */
        return res.status(204).json();
    }
}

module.exports = postController;