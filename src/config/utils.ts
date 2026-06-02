/**
 * Splits an environment variable string into an array by comma.
 * Falls back to a default value if input is not a string.
 *
 * Useful for parsing ENV vars like:
 * "a,b,c" → ["a", "b", "c"]
 *
 * @param {string[]} [defaultValue=[]] - Fallback value if input is not a string
 * @returns {(val: unknown) => string[]} Parser function compatible with zod preprocess
 *
 * @example
 * split_env_array(["default"])("a,b,c")
 * // => ["a", "b", "c"]
 *
 * @example
 * split_env_array()("a,b,c")
 * // => ["a", "b", "c"]
 *
 * @example
 * split_env_array(["default"])(undefined)
 * // => ["default"]
 */
export const split_env_array = (defaultValue: string[] = []): (val: unknown) => string[] => (val: unknown) =>
    typeof val === 'string' ? val.split(',') : defaultValue
