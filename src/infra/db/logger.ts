import type { PrismaClient as TPrismaClient } from '@prisma/client'
import type { Prisma as TPrisma } from '#root/generated/prisma'


export const setup_logging = (client: TPrismaClient, name: string) => {
    client.$on('query', (e: TPrisma.QueryEvent) => {
        console.info('--------------------')
        console.info(`[${name}] QUERY:`, e.params, `${e.duration}ms`)
        console.info(e.query)
        console.info('--------------------')
    })

    client.$on('error', (e: TPrisma.PrismaClientKnownRequestError) => {
        console.error(`[${name}] PRISMA ERROR`, e)
    })

    client.$on('warn', (e: TPrisma.LogEvent) => {
        console.warn(`[${name}] PRISMA WARN`, e)
    })
}
