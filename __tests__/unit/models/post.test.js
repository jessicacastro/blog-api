const { Post } = require('../../../src/app/models')

describe('Post Model', () => {

    it('O nome da tabela deveria ser posts.', () => {
        expect(Post.getTableName()).toBe('posts')
    })

    it('Os atributos', () => {
        const atributos = Object.keys(Post.getAttributes())
                
        // expect(atributos).toStrictEqual(['id',  'description', 'title', 'createdAt'])
        expect(atributos).toEqual(expect.arrayContaining(['id',  'description', 'title', 'createdAt']))
    })

    it('testar algum método', () => {
        // Post.nomeDoMetodo
    }) 
})