import { PrismaClient } from '#root/generated/prisma'
import { log } from '#root/scripts/utils.ts'


export const db_orm = new PrismaClient()


export const remove_data = async () => {
    log('Remove all data...', false)

    await db_orm.t_lineage_export.deleteMany()

    log('OK')
    log('')
}
