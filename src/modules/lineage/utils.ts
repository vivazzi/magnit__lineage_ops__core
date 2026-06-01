export const to_timestamp = (date: Date): number => Math.floor(date.getTime() / 1000)
export const to_timestamp_optional = (date?: Date | null): number | undefined => date ? to_timestamp(date) : undefined
