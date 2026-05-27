import { describe, it, expect } from 'vitest'
import { build_lineage_api_url } from './utils.ts'


describe('build_lineage_api_url', () => {
    it('should construct correct lineage API url for table object', () => {
        const base_url = 'https://catalog.ru/get-edc-lineage/'

        const object_url =
            'https://data-catalog.corp.tander.ru/ldmcatalog/main/ldmObjectView/(\'$obj\':\'Greenplum_dwh:___dwh/dm/whs\',\'$where\':ldm.NewLineageView)'

        const user_email = 'maltcev_a_v@magnit.ru'

        const result = build_lineage_api_url(
            base_url,
            object_url,
            user_email,
        )

        expect(result).toBe(
            'https://catalog.ru/get-edc-lineage/?ADFS_email=maltcev_a_v%40magnit.ru&obj_id=Greenplum_dwh%3A___dwh%2Fdm%2Fwhs&association=table&reference_obj=true&direction=in&horizontal_lineage=false&all_columns=false',
        )
    })

    it('should detect column association when obj_id contains 3 slashes', () => {
        const base_url = 'https://catalog.ru/get-edc-lineage/'

        const object_url =
            'https://x/(\'$obj\':\'Greenplum_dwh:___dwh/dm/whs/column_name\',\'$where\':ldm.NewLineageView)'

        const user_email = 'test@test.ru'

        const result = build_lineage_api_url(
            base_url,
            object_url,
            user_email,
        )

        expect(result).toContain('association=column')
    })

    it('should throw error if email is empty', () => {
        const base_url = 'https://catalog.ru/get-edc-lineage/'

        const object_url =
            'https://x/(\'$obj\':\'Greenplum_dwh:___dwh/dm/whs\',\'$where\':ldm.NewLineageView)'

        expect(() =>
            build_lineage_api_url(base_url, object_url, ''),
        ).toThrow()
    })
})
