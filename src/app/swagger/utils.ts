export const to_swagger_path = (path: string): string =>
    path.replaceAll(/:(\w+)/g, '{$1}')
