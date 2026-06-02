import cors from 'cors'

import { config } from '#config'


export const cors_middleware = cors({
    origin: config.cors.allowed_origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})
