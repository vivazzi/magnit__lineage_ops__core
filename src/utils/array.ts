/**
 * Returns an element from the array using cyclic rotation.
 *
 * @param source - array to rotate through
 * @param index - index position (will wrap around with modulo)
 */
export const rotate_array = <T>(source: T[], index: number): T => {
    if (source.length === 0) {
        throw new Error('rotate_array: source array cannot be empty')
    }

    return source[index % source.length]
}
