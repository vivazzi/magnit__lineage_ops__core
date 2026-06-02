import cron from 'node-cron'

import { db, Prisma, db_null } from '#db'

import { delete_file_and_maybe_folder } from './utils'
import { config } from './utils/config.ts'


const CLEANUP_LOCK_ID = 987_654_321


const clean_expired_files = async () => {
    const now = new Date()

    const expired_rows = await db.lineage_export.findMany({
        where: { result_code: 'ready', expires_at: { lt: now }, path: { not: db_null() } },
        select: { id: true, path: true },
    })

    if (expired_rows.length === 0) { return }

    console.log(`[CRON] Expiring ${expired_rows.length} files`)

    await Promise.all(
        expired_rows.map(async (row) => {
            if (!row.path) { return }

            await delete_file_and_maybe_folder(row.path)

            await db.lineage_export.update({
                where: { id: row.id },
                data: {
                    path: db_null(),
                },
            })
        }),
    )

    console.log(`[CRON] Expired ${expired_rows.length} lineage files`)
}


const acquire_lock = async () => {
    const result = await db.$queryRaw<{ locked: boolean }[]>(
        Prisma.sql`SELECT pg_try_advisory_lock(${CLEANUP_LOCK_ID}) as locked`,
    )

    return result[0]?.locked
}


const release_lock = async () => {
    await db.$executeRawUnsafe(`SELECT pg_advisory_unlock(${CLEANUP_LOCK_ID})`)
}


cron.schedule(config.cron.schedule, async () => {
    const locked = await acquire_lock()
    if (!locked) {
        return
    }

    try {
        await clean_expired_files()
    } catch (error) {
        console.error('[CRON] Cleanup failed:', error)
    } finally {
        await release_lock()
    }
})

console.log('[CRON] Lineage cleanup scheduler started')
