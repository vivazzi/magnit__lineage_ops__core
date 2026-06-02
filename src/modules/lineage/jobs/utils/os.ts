import { unlink, readdir, rmdir } from 'node:fs/promises'
import path from 'node:path'


export const delete_file_and_maybe_folder = async (file_path: string) => {
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
