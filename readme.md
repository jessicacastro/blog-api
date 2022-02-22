# Blog API

## 1. Criação do projeto

Primeiro devemos fazer é criar a pasta do nosso projeto:

```powershell
mkdir blog-api
```

Iniciaremos o projeto com o seguinte comando:

```powershell
npm init -y
```

Agora será necessário definir e instalar todas nossas dependências. Vamos utulizar o `express`, `sequelize`, `@faker-js/faker` e `mysql2`:

```powershell
npm i express sequelize mysql2 @faker-js/faker
```

Vamos inicializar o nosso app com o express para validarmos com um **Olá, Mundo!**, com isso criaremos no `index.js`:

````js
// index.js

const express = require('express')
const app = express()

app.listen(3000, () => console.log('Rodando...'))
````

Agora vamos executar para validarmos que a aplicação está funcionando:
````powershell
node index.js
````

> Não podemos esquecer de criar o arquivo `.gitignore` para nos ignorarmos o `node_modules`.


## 2. Database

Vamos adicionar um "facilitador" para conectar e utilizar o banco de dados, o `Sequelize`. Já instala-mos esse pacote anteriormente, também podemos instalar o `sequelize-cli` para podemos executar funcionalidades por linha de comando ou podemos utilizar o `npx`.

### Configuração

Primeiro vamos criar nosso arquivo de configuração do `sequelize` para poder organizarmos os arquivos gerados automaticamente nos seus devidos lugares. Começamos com o arquivo `.sequelizerc`:

````js
// .sequelizerc

const path = require("path");

module.exports = {
  'config': path.resolve('config', 'database.json'),
  'models-path': path.resolve('db', 'models'),
  'seeders-path': path.resolve('db', 'seeders'),
  'migrations-path': path.resolve('db', 'migrations')
};
````

Agora vamos executar o `sequelize-cli`:

````powershell
npx sequelize-cli init
````
> A partir desse ponto você pode ver que as pastas que vamos trablhar já foram criadas.  É importante acessar o arquivo `config/database.js` e alterar os valores de configuração do banco, por padrão usamos a key `development`.


### Migrations

````powershell
npx sequelize-cli migration:generate --name create-post
````

`db/migrations/xxxxx-create-post.js`
````js
// db/migrations/xxxxx-create-post.js

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};
````

Agora podemos executar nossa migration

````powershell
npx sequelize-cli db:migrate
````

### Factories

`db/factories/postFactory.js`
````js
// db/factories/postFactory.js
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
````


### Seeds

````powershell
npx sequelize-cli seed:generate --name posts
````

`db/seeders/xxxx-posts.js`
````js
// db/seeders/xxxx-posts.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};
````

Com tudo configurado, já podemos inserir os primeiros

````powershell
npx sequelize-cli db:seed:all 
````

> Agora é já podemos verificar banco de dados e ver que alguns dados já foram inseridos. 

### Models

`db/models/Post.js`
````js
// db/models/Post.js

module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define(
    'Post',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      createdAt: DataTypes.DATE
    },
    {
      timestamps: false,
      tableName: 'posts',
    }
  );

  return post;
};
````


## 3. Aplicação

### Controllers

`app\controllers\postController.js`
````js
// app\controllers\postController.js
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
````

### Routers

`app\routes\postRouter.js`
````js
// app\routes\postRouter.js
var express = require('express');
const postController = require('../controllers/postController');
var router = express.Router();

router.get('/', postController.index);
router.post('/', postController.store);
router.get('/:id', postController.show);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);

module.exports = router;
````

### Server

`index.js`
````js
// index.js
const express = require('express')
const app = express();
const postRouter = require('./app/routes/postRouter')

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use('/posts', postRouter);

app.listen(3000, () => console.log('Rodando...'));
````

Agora podemos executar 

````powershell
node index.js
````


