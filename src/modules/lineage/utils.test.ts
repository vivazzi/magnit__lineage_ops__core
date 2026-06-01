import { describe, expect, it } from 'vitest'
import { to_timestamp, to_timestamp_optional } from './utils.ts'


describe('to_timestamp', () => {
    it('should convert date to unix timestamp in seconds', () => {
        expect(to_timestamp(new Date('2025-01-01T00:00:00Z'))).toBe(1_735_689_600)
    })

    it('should truncate milliseconds', () => {
        expect(to_timestamp(new Date('2025-01-01T00:00:00.999Z'))).toBe(1_735_689_600)
    })
})


describe('to_timestamp_optional', () => {
    it('should convert date to unix timestamp in seconds', () => {
        expect(
            to_timestamp_optional(new Date('2025-01-01T00:00:00Z')),
        ).toBe(1_735_689_600)
    })

    it('should return undefined for undefined', () => {
        expect(to_timestamp_optional(undefined)).toBeUndefined()
    })

    it('should return undefined for null', () => {
        // eslint-disable-next-line unicorn/no-null
        expect(to_timestamp_optional(null)).toBeUndefined()
    })
})
