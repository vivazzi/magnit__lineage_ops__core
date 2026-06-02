import { constants, createReadStream } from 'node:fs'
import { access, stat } from 'node:fs/promises'
// eslint-disable-next-line unicorn/import-style
import { basename } from 'node:path'

import { LineageExportStatus } from '#db'
import { with_error_handler } from '#app/http'

import { create_lineage_task, get_lineage_task_status } from './services.ts'
import type { TLineageExportInput, TLineageTaskIdInput } from './schemas.ts'
import { ms_to_timestamp } from '#shared'


export const create_lineage_task_controller = with_error_handler<TLineageExportInput>(async (_req, res, body) => {
    const data = await create_lineage_task(body)

    return res.json(data)
})


export const get_lineage_status_controller = with_error_handler<TLineageTaskIdInput>(async (_req, res, body) => {
    const data = await get_lineage_task_status(body)

    if (!data) {
        return res.status(404).json({
            message_code: 'task_not_found',
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { path, ...safe_data } = data

    return res.json(safe_data)
})


export const download_lineage_controller = with_error_handler<TLineageTaskIdInput>(async (_req, res, body) => {
    const data = await get_lineage_task_status(body)

    if (!data) {
        return res.status(404).json({
            message_code: 'task_not_found',
        })
    }

    if (data.expires_at && data.expires_at <= ms_to_timestamp(Date.now())) {
        return res.status(410).json({
            error_code: 'file_expired',
        })
    }

    if (data.status !== LineageExportStatus.completed) {
        return res.status(409).json({ message_code: 'file_not_ready' })
    }

    if (!data.path) {
        return res.status(409).json({ error_code: 'path_not_found', status: data.status })
    }

    try {
        await access(data.path, constants.F_OK)

        const file_stat = await stat(data.path)

        if (!file_stat.isFile() || file_stat.size <= 0) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Invalid file')
        }

        // res.setHeader('X-Accel-Redirect', `${config.media.internal_prefix}/${data.path}`)  // todo: via nginx

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="${basename(data.path)}"`)
        res.setHeader('Content-Length', file_stat.size)

        // return res.end()  // todo: via nginx

        return createReadStream(data.path).pipe(res)
    } catch {
        return res.status(404).json({
            error_code: 'file_not_found',
        })
    }
})
