import express, { type Express } from 'express'

import { cors_middleware } from './middlewares'
import { router } from './routers.ts'
import { config, NODE_ENVS } from './config'


const app: Express = express()
app.use(express.json())


// - middlewares -
app.use(cors_middleware)

// - entrypoint for all routes -
app.use('', router)


export { app }  // required for tests

if (config.node_env !== NODE_ENVS.TEST) {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000')
    })
}
