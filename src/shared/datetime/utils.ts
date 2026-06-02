export const date_to_timestamp = (date: Date): number => Math.floor(date.getTime() / 1000)  // in sec
export const date_to_timestamp_optional = (date?: Date | null): number | undefined => date ? date_to_timestamp(date) : undefined

export const ms_to_timestamp = (ms: number): number => Math.floor(ms / 1000)
