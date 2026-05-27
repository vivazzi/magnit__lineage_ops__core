import { exit } from 'node:process'

import { checks, log } from '../utils.ts'
import { db_orm, remove_data } from './utils.ts'
import { generate } from '#root/scripts/generate_test_data/seed.ts'


const main = async () => {
    const args = process.argv.slice(2)

    const reset = args.includes('--reset')

    const count_arg_index = args.findIndex(arg => arg.startsWith('--count'))
    const count = count_arg_index === -1 ? 100 : Number(args[count_arg_index+1])
    
    if (reset) await remove_data()

    log('--- GENERATION ---')
    await generate(count)
    log('--- GENERATION: OK ---')
}


try {
    if (checks()) await main()
} catch (error) {
    console.error(error)
    exit(1)
} finally {
    await db_orm.$disconnect()
}
