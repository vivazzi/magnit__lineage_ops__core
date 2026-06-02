/* eslint-disable unicorn/no-null */
export type TDbNullable<T> = T | null

export type TDbField<T> = T extends null | undefined ? TDbNullable<Exclude<T, undefined>> : T

export const db_null = <T>(): TDbNullable<T> => null

export const db_nullable = <T>(value: T | undefined): TDbNullable<T> => value ?? db_null<T>()

export const db_string = (value?: string): string => value ?? ''
