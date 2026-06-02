import express, { type Express } from 'express'

import { cors_middleware } from './http/middlewares'
import { router } from './router.ts'


export const create_app = (): Express => {
    const app = express()

    app.use(express.json())
    app.use(cors_middleware)
    app.use('', router)

    return app
}
