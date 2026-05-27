import { constants } from 'node:fs'
import { access, stat } from 'node:fs/promises'
// eslint-disable-next-line unicorn/import-style
import { join, basename } from 'node:path'

import { LineageExportStatus } from '#root/generated/prisma'
import { with_error_handler } from '#src/utils/api.ts'
import { config } from '#src/config'

import { create_lineage_task, get_lineage_task_status } from './services.ts'
import type { TLineageExportInput, TLineageTaskIdInput } from './models.ts'


export const create_lineage_task_controller = with_error_handler<TLineageExportInput>(async (req, res, body) => {
    const data = await create_lineage_task(body)

    return res.json(data)
})


export const get_lineage_status_controller = with_error_handler<TLineageTaskIdInput>(async (req, res, body) => {
    const data = await get_lineage_task_status(body)

    if (!data) {
        return res.status(404).json({
            message_code: 'task_not_found',
        })
    }

    return res.json(data)
})


export const download_lineage_controller = with_error_handler<TLineageTaskIdInput>(async (req, res, body) => {
    const data = await get_lineage_task_status(body)

    if (!data) {
        return res.status(404).json({
            message_code: 'task_not_found',
        })
    }

    if (data.status !== LineageExportStatus.completed) {
        return res.status(409).json({ message_code: 'file_not_ready' })
    }

    if (!data.path) {
        return res.status(409).json({ error_code: 'path_not_found', status: data.status })
    }

    const absolute_path = join(config.media.root, data.path)

    try {
        await access(absolute_path, constants.F_OK)

        const file_stat = await stat(absolute_path)

        if (!file_stat.isFile() || file_stat.size <= 0) {
            throw new Error('Invalid file')
        }

        res.setHeader('X-Accel-Redirect', `${config.media.internal_prefix}/${data.path}`)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="${basename(data.path)}"`)
        res.setHeader('Content-Length', file_stat.size)

        return res.end()
    } catch {
        return res.status(404).json({
            error_code: 'file_not_found',
        })
    }
})
