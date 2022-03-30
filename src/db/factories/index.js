const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const factories = {}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const factory = (length, options = {}) => {
            const make = require(path.join(__dirname, file))

            if (typeof length === 'object') {
                options = length
                length = undefined
            }

            if (length == undefined) {
                const element =  make()
                Object.keys(options).forEach(key => {
                    element[key] = options[key]
                })
                return element
            }
        
            const elements = [];
        
            for (let i = 0; i < length; i++) {
                elements[i] = make()
                Object.keys(options).forEach(key => {
                    elements[i][key] = options[key]
                })
            }

            return elements
        };
        const name = file.replace('.js', '')
        factories[name] = factory
    });



module.exports = factories;