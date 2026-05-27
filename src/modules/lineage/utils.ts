const extract_obj_id_from_url = (url: string): string => {
    const match = url.match(/\('\$obj':'([^']+)'/)
    if (!match) {
        throw new Error(`Не удалось извлечь obj_id из URL: ${url}`)
    }

    return match[1]
}

const get_association = (obj_id: string): 'column' | 'table' => {
    const slash_count = (obj_id.match(/\//g) || []).length
    return slash_count === 3 ? 'column' : 'table'
}
