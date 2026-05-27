export const split_env_array = (defaultValue: string[] = []) => (val: unknown) =>
    typeof val === 'string' ? val.split(',') : defaultValue
