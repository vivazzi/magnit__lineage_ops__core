import fs from 'node:fs'
import path from 'node:path'

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import type { OpenAPIObject } from 'openapi3-ts/oas30'

import { ROUTES } from '#src/modules/lineage/routes.const.ts'

import { error_response } from './models.ts'

import {
    lineage_export_input, lineage_export_output, lineage_status_output, lineage_task_id_input,
} from '#src/modules/lineage/models.ts'
import { to_swagger_path } from './utils.ts'


const doc_description = fs.readFileSync(path.resolve(import.meta.dirname, 'descriptions/doc.md'), 'utf8')

const registry = new OpenAPIRegistry()


const common_errors = {
    400: { description: 'Ошибка валидации', content: { 'application/json': { schema: error_response } } },
    404: { description: 'Не найдёно', content: { 'application/json': { schema: error_response } } },
    405: { description: 'Метод запроса не доступен', content: { 'application/json': { schema: error_response } } },
    // 401: { description: 'Unauthorized', content: { 'application/json': { schema: error_response } } },
    500: { description: 'Ошибка сервера', content: { 'application/json': { schema: error_response } } },
}

const lineage_download_errors = {
    409: { description: 'Файл ещё не готов', content: { 'application/json': { schema: error_response } } },
}

export const TAGS = {
    LINEAGE: 'Lineage',
}


// --- LINEAGE ---
registry.registerPath({
    method: 'post',
    path: ROUTES.LINEAGE_EXPORT,
    tags: [TAGS.LINEAGE],
    description: 'Создаёт задачу на выгрузку Lineage',
    request: {
        body: { content: { 'application/json': { schema: lineage_export_input } } },
    },
    responses: {
        200: {
            description: 'Задача успешно добавлена в очередь',
            content: { 'application/json': { schema: lineage_export_output } },
        },
        ...common_errors,
    },
})


registry.registerPath({
    method: 'get',
    path: to_swagger_path(ROUTES.LINEAGE_STATUS),
    tags: [TAGS.LINEAGE],
    description: 'Возвращает статус задачи по выгрузке Lineage',
    request: {
        params: lineage_task_id_input,
    },
    responses: {
        200: {
            description: 'Статус задачи',
            content: { 'application/json': { schema: lineage_status_output } },
        },
        ...common_errors,
    },
})


registry.registerPath({
    method: 'get',
    path: to_swagger_path(ROUTES.LINEAGE_DOWNLOAD),
    tags: [TAGS.LINEAGE],
    description: 'Скачивание export-файла Lineage',
    request: {
        params: lineage_task_id_input,
    },
    responses: {
        200: {
            description: 'XLSX файл выгрузки lineage',
            content: {
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                    schema: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },

        ...lineage_download_errors,
        ...common_errors,
    },
})



const generator = new OpenApiGeneratorV3(registry.definitions)

export const openapi_doc: OpenAPIObject = generator.generateDocument({
    openapi: '3.0.0',
    info: {
        title: 'Lineage API',
        version: '1.0.0',
        description: doc_description,
    },
})
