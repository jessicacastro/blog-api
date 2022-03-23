const postRouter = require('./postRouter')

module.exports = function (app) {
    app.use('/posts', postRouter);
}