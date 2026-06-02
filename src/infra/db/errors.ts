import {
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientRustPanicError,
    PrismaClientInitializationError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library'

import { AppError, ERROR_CODES } from '#shared'


export const is_prisma_error = (error: unknown): error is Error & { code?: string } =>
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientUnknownRequestError ||
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientValidationError


const is_app_error = (error: unknown): error is AppError => error instanceof AppError


export const handle_db_error = (error: unknown): never => {
    if (is_prisma_error(error)) {

        if (error.code === 'P2025') {
            throw new AppError(ERROR_CODES.NOT_FOUND, { cause: error })
        }

        console.error('Prisma error:', error)
        throw new AppError(ERROR_CODES.PRISMA_ERROR, { cause: error })
    }

    if (is_app_error(error)) {
        throw error
    }

    console.error('Unknown DB error:', error)
    throw new AppError(ERROR_CODES.UNKNOWN_ERROR, { cause: error })
}
