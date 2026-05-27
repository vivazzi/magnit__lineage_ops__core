import type { PrismaClient } from '@prisma/client/extension'

import { PrismaClient as PrismaDB } from '#root/generated/prisma'

import type { Prisma } from '#root/generated/prisma'  // or from other client. It is no matter

import { AppError, ERROR_CODES } from '#src/utils/errors.ts'
import { is_prisma_error } from '#src/utils/prisma.ts'


// --- Prisma Clients ---

export const prisma_db = new PrismaDB({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
    ],
})


// --- Logging ---

const setup_logging = (client: PrismaClient, name: string) => {
    client.$on('query', (e: Prisma.QueryEvent) => {
        console.info('--------------------')
        console.info(`[${name}] QUERY:`, e.params, `${e.duration}ms`)
        console.info(e.query)
        console.info('--------------------')
    })

    client.$on('error', (e: Prisma.PrismaClientKnownRequestError) => {
        console.error(`[${name}] PRISMA ERROR`, e)
    })

    client.$on('warn', (e: Prisma.LogEvent) => {
        console.warn(`[${name}] PRISMA WARN`, e)
    })
}

setup_logging(prisma_db, 'DB')


// --- Wrappers ---

const handle_errors = (error: unknown): never => {
    if (is_prisma_error(error)) {
        const prisma_error = error as any

        if (prisma_error.code === 'P2025') {
            throw new AppError(ERROR_CODES.NOT_FOUND, { cause: error })
        }

        console.error('Prisma error:', error)
        throw new AppError(ERROR_CODES.PRISMA_ERROR, { cause: error })
    }

    if (error instanceof AppError) {
        throw error
    }

    console.error('Unknown DB error:', error)
    throw new AppError(ERROR_CODES.UNKNOWN_ERROR, { cause: error })
}

export const with_client = async <TClient, T>(
    client: TClient,
    fn: (client: TClient) => Promise<T>,
): Promise<T> => {
    try {
        return await fn(client)
    } catch (error: unknown) {
        handle_errors(error)
    }
}

export const with_db = <TClient, TInput, TOutput>(
    client: TClient,
    fn: (client: TClient, input: TInput) => Promise<TOutput>,
) => {
    return async (input: TInput): Promise<TOutput> => {
        return with_client(client, (c) => fn(c, input))
    }
}


// --- Utils ---

export type TDbNullable<T> = T | null

export type TDbField<T> = T extends null | undefined ? TDbNullable<Exclude<T, undefined>> : T

// eslint-disable-next-line unicorn/no-null
export const db_null = <T>(): TDbNullable<T> => null

export const db_nullable = <T>(value: T | undefined): TDbNullable<T> =>
    value ?? db_null<T>()


export const db_string = (value?: string): string => value ?? ''
