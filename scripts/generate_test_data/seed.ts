export type SeedLogger = {
    info: (text: string) => void
    success: (text: string) => void
    warn: (text: string) => void
    error: (text: string) => void
}


export interface Seed {
    name: string
    generate(count: number, ctx: SeedLogger): Promise<void>
    remove(ctx: SeedLogger): Promise<void>
}
