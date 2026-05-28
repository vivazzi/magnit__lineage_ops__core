import { exit } from 'node:process'


export const log = (text: string, is_end: boolean = true) => {
    if (is_end) {
        console.log(text)
    } else {
        process.stdout.write(text)
    }
}


export const checks = () => {
    // if (process.env.NODE_ENV === 'production') {
    //     console.error('ERROR: You cannot run data generation on production!')
    //     exit(1)
    // }

    return true
}
