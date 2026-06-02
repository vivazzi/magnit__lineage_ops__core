import { exit } from 'node:process'

export const checks = () => {
    if (process.env.NODE_ENV === 'production') {
        console.error('ERROR: You cannot run data generation on production!')
        exit(1)
    }

    return true
}
