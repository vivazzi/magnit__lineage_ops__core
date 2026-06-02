import { exit } from 'node:process'

import { db } from '#db'

import { checks, log } from '#scripts/shared'

import { LineageExportSeed } from './data'
import type { SeedLogger } from './seed.ts'


const seeds = [
    new LineageExportSeed(),
]

const seed_logger: SeedLogger = {
    info: log.line,
    success: (t) => log.line(`✔ ${t}`),
    warn: (t) => log.line(`⚠ ${t}`),
    error: (t) => log.line(`✖ ${t}`),
}

const main = async () => {
    const args = process.argv.slice(2)

    const reset = args.includes('--reset')

    const count_arg_index = args.findIndex(arg => arg.startsWith('--count'))
    const count = count_arg_index === -1 ? 100 : Number(args[count_arg_index+1])
    
    if (reset) {
        log.line('--- Test Data Generation ---\n')

        log.line('- Removing data... -')

        for (const seed of seeds) {
            log.line(`🗑️ ${seed.name}`)
            await seed.remove(seed_logger)
        }

        log.line('- OK -\n')
    }

    log.line('--- GENERATION ---')

    for (const seed of seeds) {
        log.line(`| ${seed.name}`)

        await log.indent(async () => {
            await seed.generate(count, seed_logger)
        })
    }

    log.line('- OK -')
}


try {
    if (checks()) await main()
} catch (error) {
    console.error(error)
    exit(1)
} finally {
    await db.$disconnect()
}
