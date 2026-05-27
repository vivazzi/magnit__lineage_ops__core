export const create_test_lineage_buffer = async (): Promise<Buffer> => {
    const fakeData = 'id,name,value\n1,foo,123\n2,bar,456'
    return Buffer.from(fakeData, 'utf8')
}
