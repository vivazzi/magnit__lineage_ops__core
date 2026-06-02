export const ERROR_CODES = {
    NOT_FOUND: 'not_found',
    PRISMA_ERROR: 'prisma_error',
    INVALID_INPUT: 'invalid_input',
    METHOD_NOT_ALLOWED: 'method_not_allowed',
    UNKNOWN_ERROR: 'unknown_error',
} as const


export const ERROR_STATUS_MAP: Record<TErrorCode, number> = {
    [ERROR_CODES.NOT_FOUND]: 404,
    [ERROR_CODES.PRISMA_ERROR]: 500,
    [ERROR_CODES.INVALID_INPUT]: 400,
    [ERROR_CODES.METHOD_NOT_ALLOWED]: 405,
    [ERROR_CODES.UNKNOWN_ERROR]: 500,
}

export type TErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]


export class AppError extends Error {
    code: TErrorCode

    constructor(
        code: TErrorCode,
        options?: { cause?: unknown },
    ) {
        super(code, { cause: options?.cause })
        this.code = code

        Object.setPrototypeOf(this, new.target.prototype)
    }
}
