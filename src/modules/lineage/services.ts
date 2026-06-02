import { db, with_db } from '#db'

import { ROUTES } from './router.ts'
import {
    type TLineageStatusOutput, type TLineageExportInput, type TLineageExportOutput, type TLineageTaskIdInput,
} from './schemas.ts'
import { map_lineage_task } from './mapper.ts'


const extract_obj_id_from_url = (url: string): string | undefined => {
    const match = url.match(/\('\$obj':'([^']+)'/)
    return match ? match[1] : undefined
}


const define_association = (obj_id: string): 'column' | 'table' => {
    const slash_count = (obj_id?.match(/\//g) || []).length
    return slash_count === 3 ? 'column' : 'table'
}


const get_or_create_user = async (client: typeof db, email: string) =>
    client.user.upsert({
        where: { email },
        update: {},
        create: { email },
    })


export const create_lineage_task = with_db<
    typeof db,
    TLineageExportInput,
    TLineageExportOutput
>(db, async (client, {
    object_url,
    user_email,
    is_reference_obj,
    direction,
    is_horizontal_lineage,
    is_all_columns,
}) => {
    const obj_id = extract_obj_id_from_url(object_url)

    if (!obj_id) {
        throw new Error(`Failed to extract obj_id from url ${object_url}`)
    }

    const association = define_association(obj_id)

    const user = await get_or_create_user(client, user_email)

    const lineage = await client.lineage_export.create({
        data: {
            user_id: user.id,

            obj_id,
            association,
            is_reference_obj,
            direction,
            is_horizontal_lineage,
            is_all_columns,
        },
    })

    return { task_id: lineage.id, download_url: ROUTES.LINEAGE_DOWNLOAD.replace(':task_id', lineage.id.toString()) }
})


export const get_lineage_task_status = with_db<
    typeof db,
    TLineageTaskIdInput,
    TLineageStatusOutput | undefined
>(db, async (client, { task_id }) => {
    const row = await client.lineage_export.findUnique({
        where: { id: task_id },
    })

    if (!row) return undefined

    return map_lineage_task(row)
})
