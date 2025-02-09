const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//setup options for swagger-jsdoc
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MiniStore API', // Title of the API
            version: '1.0.0',
            description: 'Learning how to use the MiniStore API',
        },
        servers: [
            {url: 'http://localhost:8800/',
                description: 'My API throught HTTP'
            },
            {url: 'https://localhost:8443/',
                description: 'My API throught HTTPS'
            },
        ]
    },
    apis: ['./routes/*.js']
};
const swaggerSpecs = swaggerJSDoc(swaggerOptions);

module.exports = {swaggerSpecs,swaggerUI};