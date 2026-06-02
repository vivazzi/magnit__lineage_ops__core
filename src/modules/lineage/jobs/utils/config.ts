import { z } from 'zod'

import { node_envs, NODE_ENVS } from '#config'


const config_schema = z.object({
    NODE_ENV: z.enum(node_envs).default(NODE_ENVS.DEVELOPMENT),
    CRON_CLEAN__SCHEDULE: z.string(),
})


const parsed = config_schema.parse(process.env)


export const config = {
    node_env: parsed.NODE_ENV,

    media: {
        root: '/app/media',
    },

    cron: {
        schedule: parsed.CRON_CLEAN__SCHEDULE,
    },
} as const
