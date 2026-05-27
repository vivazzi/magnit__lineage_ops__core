/* eslint-disable unicorn/no-null */
import { log } from '../utils.ts'
import { db_orm } from './utils.ts'
import { LineageExportStatus, LineageDirection } from '#root/generated/prisma'


const base_params = (i: number, suffix: string) => ({
    user_email: `${suffix}_${i}@test.ru`,
    obj_id: `obj_${suffix}_${i}`,
    association: 'test',

    is_reference_obj: false,
    direction: LineageDirection.in,

    is_horizontal_lineage: false,
    is_all_columns: false,
})


export const generate = async (count: number) => {
    log('| t_lineage_export')

    const base = Date.now()
    const tasks = []

    // -----------------------
    // NEW
    // -----------------------
    for (let i = 0; i < count; i++) {
        const task = await db_orm.t_lineage_export.create({
            data: {
                status: LineageExportStatus.new,

                created_at_ts: BigInt(base + i),

                ...base_params(i, 'new'),
            },
        })

        tasks.push(task)
    }

    // -----------------------
    // IN_PROGRESS
    // -----------------------
    for (let i = 0; i < count; i++) {
        const task = await db_orm.t_lineage_export.create({
            data: {
                status: LineageExportStatus.in_progress,

                created_at_ts: BigInt(base + 1000 + i),
                started_at_ts: BigInt(base + 2000 + i),
                attempt: 1,

                ...base_params(i, 'progress'),
            },
        })

        tasks.push(task)
    }

    // -----------------------
    // COMPLETED
    // -----------------------
    for (let i = 0; i < count; i++) {
        const task = await db_orm.t_lineage_export.create({
            data: {
                status: LineageExportStatus.completed,

                created_at_ts: BigInt(base + 3000 + i),
                started_at_ts: BigInt(base + 4000 + i),
                finished_at_ts: BigInt(base + 5000 + i),

                attempt: 2,

                result_code: 'ready',
                error_code: null,
                error_message: null,
                path: `/tmp/export_completed_${i}.xlsx`,

                ...base_params(i, 'completed'),
            },
        })

        tasks.push(task)
    }

    // -----------------------
    // FAILED
    // -----------------------
    for (let i = 0; i < count; i++) {
        const task = await db_orm.t_lineage_export.create({
            data: {
                status: LineageExportStatus.failed,

                created_at_ts: BigInt(base + 6000 + i),
                started_at_ts: BigInt(base + 7000 + i),
                finished_at_ts: BigInt(base + 8000 + i),

                attempt: 3,

                result_code: null,
                error_code: 'timeout',
                error_message: 'Generation timeout',
                path: null,

                ...base_params(i, 'failed'),
            },
        })

        tasks.push(task)
    }

    log(`created: ${tasks.length}`)
}
