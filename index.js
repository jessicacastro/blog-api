const express = require('express')
const app = express();
const postRouter = require('./app/routes/postRouter')

app.use(express.json());
app.use('/posts', postRouter);

app.listen(3000, () => console.log('Rodando...'));