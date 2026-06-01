import { Router } from 'express'

import { validate_body, validate_params } from '#src/utils/api.ts'

import { ROUTES } from './routes.const.ts'
import { lineage_export_input, lineage_task_id_input } from './models.ts'
import { create_lineage_task_controller, get_lineage_status_controller, download_lineage_controller } from './controllers.ts'

const router: Router = Router()


// --- Routes ---
router.post(ROUTES.LINEAGE_EXPORT, validate_body(lineage_export_input), create_lineage_task_controller)
router.get(ROUTES.LINEAGE_STATUS, validate_params(lineage_task_id_input), get_lineage_status_controller)
router.get(ROUTES.LINEAGE_DOWNLOAD, validate_params(lineage_task_id_input), download_lineage_controller)

export { router }
