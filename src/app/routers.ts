import { Router } from 'express'

import { swagger_router } from '../swagger'
import { lineage_router } from '../modules'


const router: Router = Router()

router.use('', swagger_router)
router.use('', lineage_router)

router.get('/health', (_req, res) => res.end())


export { router }
