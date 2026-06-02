const create_logger = (base_indent = 0) => {
    let indent = base_indent

    const pad = (text: string) => ' '.repeat(indent) + text

    return {
        line(text: string) {
            console.log(pad(text))
        },

        async indent(fn: () => Promise<void> | void) {
            indent += 2
            try {
                await fn()
            } finally {
                indent -= 2
            }
        },
    }
}

export const log = create_logger()
