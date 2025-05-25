import swaggerJSDoc from "swagger-jsdoc"
import { SwaggerUiOptions } from "swagger-ui-express"

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.1.1',
        tags: [
            {
                name: 'Users',
                description: 'API operations related to Users'
            },
            {
                name: 'Projects',
                description: 'API operations related to Projects'
            },
            {
                name: 'Classrooms',
                description: 'API operations related to Classrooms'
            },
            {
                name: 'ChatMessages',
                description: 'API operations related to ChatMessages'
            }
        ],
        info: {
            title: 'API monolithic documentation in Express',
            version: '1.0.0',
            description: 'API Docs for Edunet'
        }
    },
    apis: ['./src/router.ts']
}
const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
    customCss : `
        .topbar {
            display: none
        }
    `
}

export default swaggerSpec
export { swaggerUiOptions }