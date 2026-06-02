import { to_timestamp, to_timestamp_optional } from '#shared'

import { result_codes } from './schemas.ts'
import type { TLineageExport } from '#infra/db'


export const map_lineage_task = (row: TLineageExport) => ({
    status: row.status,

    result_code: row.result_code ? result_codes.parse(row.result_code) : undefined,
    attempt_count: row.attempt_count,

    error_code: row.error_code ?? undefined,
    error_message: row.error_message ?? undefined,

    path: row.path ?? undefined,

    created_at: to_timestamp(row.created_at),
    started_at: to_timestamp_optional(row.started_at),
    finished_at: to_timestamp_optional(row.finished_at),
    expires_at: to_timestamp_optional(row.expires_at),
})


// todo: use this map for output (or this useless?)
// export const map_lineage_task = (row: lineage_export) => ({
//     status: row.status,
//     result_code: row.result_code ? result_codes.parse(row.result_code) : undefined,
//
//     error_code: row.error_code ?? undefined,
//
//     expires_at: to_timestamp_optional(row.expires_at),
//
//     estimated_queue_delay_ms: undefined,
//     estimated_processing_duration_ms: undefined,
// })
