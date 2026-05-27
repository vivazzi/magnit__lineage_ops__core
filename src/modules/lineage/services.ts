import { prisma_db, with_db } from '#src/utils/db.ts'

import {
    type TLineageStatusOutput, type TLineageExportInput, type TLineageExportOutput, type TLineageTaskIdInput, result_codes,
} from './models.ts'


const extract_obj_id_from_url = (url: string): string | undefined => {
    const match = url.match(/\('\$obj':'([^']+)'/)
    return match ? match[1] : undefined
}


const define_association = (obj_id: string): 'column' | 'table' => {
    const slash_count = (obj_id?.match(/\//g) || []).length
    return slash_count === 3 ? 'column' : 'table'
}


export const create_lineage_task = with_db<
    typeof prisma_db,
    TLineageExportInput,
    TLineageExportOutput
>(prisma_db, async (client, {
    object_url,
    user_email,
    is_reference_obj,
    direction,
    is_horizontal_lineage,
    is_all_columns,
}) => {
    // console.log('config.lineage.api_url', config.lineage.api_url)
    // console.log('object_url', object_url)
    const obj_id = extract_obj_id_from_url(object_url)

    if (!obj_id) {
        throw new Error(`Failed to extract obj_id from url ${object_url}`)
    }

    const association = define_association(obj_id)

    const lineage = await client.t_lineage_export.create({
        data: {
            created_at_ts: BigInt(Date.now()),

            user_email,

            obj_id,
            association,
            is_reference_obj,
            direction,
            is_horizontal_lineage,
            is_all_columns,
        },
    })

    return { task_id: lineage.id, download_url: `/lineage/${lineage.id}` }
})


export const get_lineage_task_status = with_db<
    typeof prisma_db,
    TLineageTaskIdInput,
    TLineageStatusOutput | undefined
>(prisma_db, async (client, { task_id }) => {
    const row = await client.t_lineage_export.findUnique({
        where: { id: task_id },
    })

    if (!row) return undefined

    return {
        status: row.status,
        result_code: row.result_code ? result_codes.parse(row.result_code) : undefined,
        attempt: row.attempt,
        error_code: row.error_code ?? undefined,
        error_message: row.error_message ?? undefined,
        path: row.path ?? undefined,
        created_at_ts: Number(row.created_at_ts),
        started_at_ts: row.started_at_ts ? Number(row.started_at_ts) : undefined,
        finished_at_ts: row.finished_at_ts ? Number(row.finished_at_ts) : undefined,
        expires_at_ts: row.expires_at_ts ? Number(row.expires_at_ts) : undefined,
    }
})
