export const NODE_ENVS = {
    DEVELOPMENT: 'development',
    TEST: 'test',
    PRODUCTION: 'production',
} as const

export type TNodeEnv = typeof NODE_ENVS[keyof typeof NODE_ENVS]

export const node_envs = Object.values(NODE_ENVS) as [TNodeEnv, ...TNodeEnv[]]
