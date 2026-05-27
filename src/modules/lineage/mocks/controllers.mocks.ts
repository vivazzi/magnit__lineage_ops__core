import { with_error_handler } from '#src/utils/api.ts'

import { create_test_lineage_buffer } from '../services/lineage.mocks.ts'
import { test_lineage_export_api_url_input, type TTestLineageExportApiUrlInput } from '../models/lineage.mocks.ts'


export const create_test_lineage_controller = with_error_handler<TTestLineageExportApiUrlInput>(
    async (req, res, body) => {
        const parsed = test_lineage_export_api_url_input.parse(req.query)

        // Генерируем "файл" в памяти
        const buffer = await create_test_lineage_buffer()

        // Отдаем его как XLSX (можно поменять на CSV или Excel)
        const filename = 'lineage.xlsx'

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
        res.setHeader('Content-Length', buffer.length)

        res.send(buffer)

        return parsed
    },
)
