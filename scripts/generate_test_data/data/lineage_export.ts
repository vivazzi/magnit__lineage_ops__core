import { db, LineageExportStatus, LineageDirection, LineageAssociation, type TPrisma } from '#db'

import { now } from '#scripts/shared'

import type { Seed, SeedLogger } from '../seed.ts'


type TCreateInput = TPrisma.lineage_exportUncheckedCreateInput


const base_params = (i: number, suffix: string) => ({
    user_email: `${suffix}_${i}@test.ru`,
    obj_id: `obj_${suffix}_${i}`,

    association: LineageAssociation.table,

    is_reference_obj: false,
    direction: LineageDirection.in,
    is_horizontal_lineage: false,
    is_all_columns: false,
})


const create_many = (items: TCreateInput[]) => {
    return db.lineage_export.createMany({
        data: items,
    })
}


export class LineageExportSeed implements Seed {
    name = 'lineage_export'

    async remove(_seed_logger: SeedLogger) {
        await db.lineage_export.deleteMany()
    }

    async generate(count: number, seed_logger: SeedLogger) {
        await this.generate_new(count)
        await this.generate_in_progress(count)
        await this.generate_completed(count)
        await this.generate_failed(count)

        seed_logger.success(`done: ${count * 4}`)
    }

    // -----------------------
    // NEW
    // -----------------------
    private async generate_new(count: number) {
        await create_many(
            Array.from({ length: count }, (_, i) => ({
                status: LineageExportStatus.new,
                created_at: new Date(now + i),
                attempt_count: 0,
                ...base_params(i, 'new'),
            })),
        )
    }

    // -----------------------
    // IN_PROGRESS
    // -----------------------
    private async generate_in_progress(count: number) {
        await create_many(
            Array.from({ length: count }, (_, i) => ({
                status: LineageExportStatus.in_progress,
                created_at: new Date(now + 1000 + i),
                started_at: new Date(now + 2000 + i),
                attempt_count: 1,
                ...base_params(i, 'progress'),
            })),
        )
    }

    // -----------------------
    // COMPLETED
    // -----------------------
    private async generate_completed(count: number) {
        await create_many(
            Array.from({ length: count }, (_, i) => ({
                status: LineageExportStatus.completed,
                created_at: new Date(now + 3000 + i),
                started_at: new Date(now + 4000 + i),
                finished_at: new Date(now + 5000 + i),
                attempt_count: 2,

                result_code: 'ready',
                path: `/tmp/export_completed_${i}.xlsx`,

                ...base_params(i, 'completed'),
            })),
        )
    }

    // -----------------------
    // FAILED
    // -----------------------
    private async generate_failed(count: number) {
        await create_many(
            Array.from({ length: count }, (_, i) => ({
                status: LineageExportStatus.failed,
                created_at: new Date(now + 6000 + i),
                started_at: new Date(now + 7000 + i),
                finished_at: new Date(now + 8000 + i),
                attempt_count: 3,

                error_code: 'timeout',
                error_message: 'Generation timeout',

                ...base_params(i, 'failed'),
            })),
        )
    }
}
