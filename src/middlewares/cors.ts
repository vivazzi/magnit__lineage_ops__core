import cors from 'cors'

import { config } from '../config'

const allowed_origins = config.cors.allowed_origins
const origin_option = allowed_origins.length === 1 && allowed_origins[0] === '*' ? '*' : allowed_origins


export const cors_middleware = cors({
    origin: origin_option,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})
