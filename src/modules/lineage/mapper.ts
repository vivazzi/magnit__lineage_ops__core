import { to_timestamp, to_timestamp_optional } from '#src/modules/lineage/utils.ts'
import { result_codes } from '#src/modules/lineage/models.ts'
import type { lineage_export } from '#root/generated/prisma'


export const map_lineage_task = (row: lineage_export) => ({
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


// import { to_timestamp_optional } from '#src/modules/lineage/utils.ts'
// import { result_codes } from '#src/modules/lineage/models.ts'
// import type { lineage_export } from '#root/generated/prisma'
//
//
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
