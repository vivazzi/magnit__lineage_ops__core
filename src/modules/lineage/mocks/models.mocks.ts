import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)


export const test_lineage_export_api_url_input = z.object({
    ADFS_email: z.string().email(),
    obj_id: z.string(),
    association: z.enum(['table', 'column']),
    reference_obj: z.enum(['true', 'false']),
    direction: z.enum(['in', 'out', 'both']),
    horizontal_lineage: z.enum(['true', 'false']),
    all_columns: z.enum(['true', 'false']),
})

export type TTestLineageExportApiUrlInput = z.infer<typeof test_lineage_export_api_url_input>
