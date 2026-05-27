import { z } from 'zod'

import { node_envs, NODE_ENVS } from './models.ts'
import { split_env_array } from './utils.ts'


const config_schema = z.object({
    NODE_ENV: z.enum(node_envs).default(NODE_ENVS.DEVELOPMENT),
    CORE__ALLOWED_ORIGINS: z.preprocess(split_env_array(['*']), z.array(z.string())),
    CORE__DOWNLOAD_LINEAGE_API_URL: z.string(),
})


const parsed = config_schema.parse(process.env)


export const config = {
    node_env: parsed.NODE_ENV,

    media: {
        root: '/app/media',

        // публичный префикс nginx
        url_prefix: '/media',

        // внутренний nginx location (X-Accel)
        internal_prefix: '/internal-media',
    },

    lineage: {
        api_url: parsed.CORE__DOWNLOAD_LINEAGE_API_URL,
    },

    cors: {
        allowed_origins: parsed.CORE__ALLOWED_ORIGINS,
    },
} as const
