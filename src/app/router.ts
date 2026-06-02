import { Router } from 'express'

import { lineage_router } from '#modules/lineage'
import { swagger_router } from './swagger'


const router: Router = Router()

router.use('', lineage_router)
router.use('', swagger_router)

router.get('/health', (_req, res) => res.end())

export { router }
