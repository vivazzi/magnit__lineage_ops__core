import { handle_db_error } from './errors.ts'


export const with_client = async <TClient, T>(
    client: TClient,
    fn: (client: TClient) => Promise<T>,
): Promise<T> => {
    try {
        return await fn(client)
    } catch (error: unknown) {
        return handle_db_error(error)
    }
}

export const with_db = <TClient, TInput, TOutput>(
    client: TClient,
    fn: (client: TClient, input: TInput) => Promise<TOutput>,
) => {
    return async (input: TInput): Promise<TOutput> => {
        return with_client(client, (c) => fn(c, input))
    }
}
