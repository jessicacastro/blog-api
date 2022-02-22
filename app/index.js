const dotenv = require('dotenv')
dotenv.config({
    path: process.env.NODE_ENV == 'test' ? '.env.test' : '.env'
})

const express = require('express')
const app = express();
const postRouter = require('./routes/postRouter')

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use('/posts', postRouter);

module.exports = app;