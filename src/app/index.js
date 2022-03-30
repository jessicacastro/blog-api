const dotenv = require('dotenv')
dotenv.config({
    path: process.env.NODE_ENV == 'test' ? '.env.test' : '.env'
})

const express = require('express')
const app = express();
const routers = require('./routers')
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../docs/swagger_output.json')

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
routers(app)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// set routers

module.exports = app;