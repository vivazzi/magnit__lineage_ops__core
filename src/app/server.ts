import { create_app } from './app.ts'
import { bootstrap } from './bootstrap.ts'
import { config, NODE_ENVS } from '../config'


bootstrap()

const app = create_app()

if (config.node_env !== NODE_ENVS.TEST) {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000')
    })
}

export { app }
