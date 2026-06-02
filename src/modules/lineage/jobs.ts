import cron from 'node-cron'
import { unlink, readdir, rmdir } from 'node:fs/promises'
import path from 'node:path'

import { db } from '#db'


const delete_file_and_maybe_folder = async (file_path: string) => {
    try {
        await unlink(file_path)
    } catch {
        console.warn('[CRON] Failed to delete file:', file_path)
        return
    }

    const dir = path.dirname(file_path)

    try {
        const files = await readdir(dir)
        if (files.length === 0) {
            await rmdir(dir)
            console.log('[CRON] Removed empty dir:', dir)
        }
    } catch {
        console.warn('[CRON] Failed to clean dir:', dir)
    }
}


const clean_expired_files = async () => {
    const now = Math.floor(Date.now() / 1000)

    // 1️⃣ Сначала выбираем все файлы ready, которые просрочены
    const expired_rows = await db.lineage_export.findMany({
        where: { status: 'ready', expired_at: { lt: now } },
        select: { id: true, path: true },
    })

    if (expired_rows.length === 0) return console.log('[CRON] No expired lineage files')

    console.log(`[CRON] Expiring ${expired_rows.length} files`)

    // 2️⃣ Ставим всем статус 'expiring', чтобы никто другой не схватил
    await Promise.all(
        expired_rows.map(row =>
            db.lineage_export.update({
                where: { id: row.id },
                data: { status: 'expiring' },
            }),
        ),
    )

    // 3️⃣ Удаляем файлы и директории + ставим статус 'expired'
    await Promise.all(
        expired_rows.map(async (row) => {
            if (!row.path) return
            const full_path = path.resolve(row.path)

            await delete_file_and_maybe_folder(full_path)

            await db.lineage_export.update({
                where: { id: row.id },
                data: { status: 'expired' },
            })
        }),
    )

    console.log(`[CRON] Expired ${expired_rows.length} lineage files`)
}


const acquire_lock = async () => {
    const result: any = await db.$queryRawUnsafe(
        'SELECT pg_try_advisory_lock(987654321) as locked',
    )
    return result[0]?.locked === true
}


const release_lock = async () => {
    await db.$executeRawUnsafe('SELECT pg_advisory_unlock(987654321)')
}


cron.schedule('*/20 * * * *', async () => {
    const locked = await acquire_lock()
    if (!locked) return console.log('[CRON] Another instance is running')

    try {
        await clean_expired_files()
    } catch (error) {
        console.error('[CRON] Cleanup failed:', error)
    } finally {
        await release_lock()
    }
})

console.log('[CRON] Lineage cleanup scheduler started')
