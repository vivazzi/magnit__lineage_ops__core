export const to_ts = (date: Date): number => Math.floor(date.getTime() / 1000)
export const to_ts_optional = (date?: Date | null): number | undefined => date ? to_ts(date) : undefined
