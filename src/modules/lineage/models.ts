import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

import { LineageDirection, LineageExportStatus } from '#root/generated/prisma'
import { timestamp } from '#src/utils/datetime.ts'

extendZodWithOpenApi(z)


export const lineage_export_input = z.object({
    object_url: z.string(),
    user_email: z.string().email(),
    is_reference_obj: z.boolean(),
    direction: z.nativeEnum(LineageDirection),
    is_horizontal_lineage: z.boolean(),
    is_all_columns: z.boolean(),
})

export type TLineageExportInput = z.infer<typeof lineage_export_input>


export const lineage_export_output = z.object({
    task_id: z.coerce.number().int(),
    download_url: z.string(),
})

export type TLineageExportOutput = z.infer<typeof lineage_export_output>


export const lineage_task_id_input = z.object({
    task_id: z.coerce.number().int(),
})

export type TLineageTaskIdInput = z.infer<typeof lineage_task_id_input>


export const result_codes = z.enum(['ready', 'empty', 'not_found'])

export type TResultCode = z.infer<typeof result_codes>


export const lineage_status_output = z.object({
    status: z.nativeEnum(LineageExportStatus),

    result_code: result_codes.optional(),
    attempt_count: z.number(),

    error_code: z.string().optional(),
    error_message: z.string().optional(),

    path: z.string().optional(),

    created_at: timestamp,
    started_at: timestamp.optional(),
    finished_at: timestamp.optional(),
    expires_at: timestamp.optional(),
}).superRefine((data, ctx) => {
    if (data.status === 'completed') {
        if (!data.path) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'completed job must have path',
                path: ['path'],
            })
        }

        if (!data.result_code) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'completed job must have result_code',
                path: ['result_code'],
            })
        }
    }
})

export type TLineageStatusOutput = z.infer<typeof lineage_status_output>
