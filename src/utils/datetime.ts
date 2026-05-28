import { z } from 'zod'


export const timestamp = z.number().int().nonnegative()
export type TTimestamp = z.infer<typeof timestamp>
