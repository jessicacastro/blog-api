const dotenv = require('dotenv')
dotenv.config({
    path: process.env.NODE_ENV == 'test' ? '.env.test' : '.env'
})

const express = require('express')
const app = express();
const postRouter = require('./routes/postRouter')

app.use(express.json());
app.use('/posts', postRouter);

module.exports = app;