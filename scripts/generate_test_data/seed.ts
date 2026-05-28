 
import { log } from '../utils.ts'
import { db_orm } from './utils.ts'
import { LineageExportStatus, LineageDirection, LineageAssociation } from '#root/generated/prisma'


const now = Date.now()

const base_params = (i: number, suffix: string) => ({
    user_email: `${suffix}_${i}@test.ru`,
    obj_id: `obj_${suffix}_${i}`,

    association: LineageAssociation.table,

    is_reference_obj: false,
    direction: LineageDirection.in,

    is_horizontal_lineage: false,
    is_all_columns: false,
})


const create_task = async (data: any) => db_orm.lineage_export.create({ data })


export const generate = async (count: number) => {
    log('| lineage_export')

    const tasks = []

    // -----------------------
    // NEW
    // -----------------------
    for (let i = 0; i < count; i++) {
        tasks.push(
            await create_task({
                status: LineageExportStatus.new,
                created_at: new Date(now + i),
                attempt_count: 0,
                ...base_params(i, 'new'),
            }),
        )
    }

    // -----------------------
    // IN_PROGRESS
    // -----------------------
    for (let i = 0; i < count; i++) {
        tasks.push(
            await create_task({
                status: LineageExportStatus.in_progress,
                created_at: new Date(now + 1000 + i),
                started_at: new Date(now + 2000 + i),
                attempt_count: 1,
                ...base_params(i, 'progress'),
            }),
        )
    }

    // -----------------------
    // COMPLETED
    // -----------------------
    for (let i = 0; i < count; i++) {
        tasks.push(
            await create_task({
                status: LineageExportStatus.completed,

                created_at: new Date(now + 3000 + i),
                started_at: new Date(now + 4000 + i),
                finished_at: new Date(now + 5000 + i),

                attempt_count: 2,

                result_code: 'ready',
                error_code: undefined,
                error_message: undefined,
                path: `/tmp/export_completed_${i}.xlsx`,

                ...base_params(i, 'completed'),
            }),
        )
    }

    // -----------------------
    // FAILED
    // -----------------------
    for (let i = 0; i < count; i++) {
        tasks.push(
            await create_task({
                status: LineageExportStatus.failed,

                created_at: new Date(now + 6000 + i),
                started_at: new Date(now + 7000 + i),
                finished_at: new Date(now + 8000 + i),

                attempt_count: 3,

                result_code: undefined,
                error_code: 'timeout',
                error_message: 'Generation timeout',
                path: undefined,

                ...base_params(i, 'failed'),
            }),
        )
    }

    log(`created: ${tasks.length}`)
}
