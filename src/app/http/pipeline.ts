import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

import { is_prisma_error } from '#infra/db/errors.ts'
import { AppError, ERROR_CODES, ERROR_STATUS_MAP } from '#shared'


export const with_error_handler = <TBody>(
    handler: (req: Request, res: Response, body: TBody) => Promise<void | Response>,
) => {
    return async (req: Request, res: Response) => {
        try {
            return await handler(req, res, (req as unknown).parsedBody as TBody)
        } catch (error: unknown) {
            console.error('[CONTROLLER]', error)

            if (error instanceof AppError) {
                return res.status(ERROR_STATUS_MAP[error.code] ?? 500).json({ code: error.code })
            }

            if (is_prisma_error(error)) {
                return res.status(500).json({ code: ERROR_CODES.PRISMA_ERROR })
            }

            return res.status(500).json({ code: ERROR_CODES.UNKNOWN_ERROR })
        }
    }
}


export const validate_body =
    <T>(schema: ZodSchema<T>) =>
        (req: Request, res: Response, next: NextFunction) => {
            const parsed = schema.safeParse(req.body)
            if (!parsed.success) {
                return res.status(400).json({ code: ERROR_CODES.INVALID_INPUT, error: parsed.error })
            }

            (req as unknown).parsedBody = parsed.data
            next()
        }


export const validate_params =
    <T>(schema: ZodSchema<T>) =>
        (req: Request, res: Response, next: NextFunction) => {
            const parsed = schema.safeParse(req.params)
            if (!parsed.success) {
                return res.status(400).json({ code: ERROR_CODES.INVALID_INPUT, error: parsed.error })
            }

            (req as unknown).parsedBody = parsed.data
            next()
        }


export const validate_query =
    <T>(schema: ZodSchema<T>) =>
        (req: Request, res: Response, next: NextFunction) => {
            const parsed = schema.safeParse(req.query)
            if (!parsed.success) {
                return res.status(400).json({ code: ERROR_CODES.INVALID_INPUT, error: parsed.error })
            }

            (req as unknown).parsedBody = parsed.data
            next()
        }
