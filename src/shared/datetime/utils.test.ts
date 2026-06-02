import { describe, expect, it } from 'vitest'
import { date_to_timestamp, date_to_timestamp_optional } from './utils.ts'


describe('date_to_timestamp', () => {
    it('should convert date to unix timestamp in seconds', () => {
        expect(date_to_timestamp(new Date('2025-01-01T00:00:00Z'))).toBe(1_735_689_600)
    })

    it('should truncate milliseconds', () => {
        expect(date_to_timestamp(new Date('2025-01-01T00:00:00.999Z'))).toBe(1_735_689_600)
    })
})


describe('date_to_timestamp_optional', () => {
    it('should convert date to unix timestamp in seconds', () => {
        expect(
            date_to_timestamp_optional(new Date('2025-01-01T00:00:00Z')),
        ).toBe(1_735_689_600)
    })

    it('should return undefined for undefined', () => {
        expect(date_to_timestamp_optional(undefined)).toBeUndefined()
    })

    it('should return undefined for null', () => {
        // eslint-disable-next-line unicorn/no-null
        expect(date_to_timestamp_optional(null)).toBeUndefined()
    })
})
