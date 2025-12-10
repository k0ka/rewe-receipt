export default {
    api: {
        input: './src/api/ReweReceipt.Web.json',
        output: {
            target: './src/api/endpoints',
            schemas: './src/api/schemas',
            mode: 'tags',
            client: 'react-query',
            httpClient: 'fetch',
            prettier: true,
            namingConvention: 'camelCase',
            clean: ['src/api/endpoints', 'src/api/schemas'],
            override: {
                mutator: {
                    path: './src/custom-fetch.ts',
                    name: 'customFetch',
                },
            },
        }
    },
};