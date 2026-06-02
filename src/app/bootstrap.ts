import { db, setup_logging } from '#db'


export const bootstrap = () => {
    setup_logging(db, 'DB')
}
