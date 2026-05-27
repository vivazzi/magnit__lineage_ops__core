import { Router } from 'express'

import {
    validate_body, validate_params,
    // validate_query,
} from '#src/utils/api.ts'

import { ROUTES } from './routes.const.ts'
import { lineage_export_input, lineage_task_id_input } from './models.ts'
import { create_lineage_task_controller, get_lineage_status_controller, download_lineage_controller } from './controllers.ts'

// import { config, NODE_ENVS } from '#src/config'
// import { create_test_lineage_controller } from '#src/modules/core/controllers/lineage.mocks.ts'
// import { test_lineage_export_api_url_input } from '#src/modules/core/models/lineage.mocks.ts'
//

const router: Router = Router()


// --- Routes ---
router.post(ROUTES.LINEAGE_EXPORT, validate_body(lineage_export_input), create_lineage_task_controller)
router.get(ROUTES.LINEAGE_STATUS, validate_params(lineage_task_id_input), get_lineage_status_controller)
router.get(ROUTES.LINEAGE_DOWNLOAD, validate_params(lineage_task_id_input), download_lineage_controller)

// if (config.node_env === NODE_ENVS.DEVELOPMENT) {
//     router.post(
//         ROUTES.TEST_LINEAGE_EXPORT_FILE, validate_query(test_lineage_export_api_url_input), create_test_lineage_controller,
//     )
// }
//


export { router }
