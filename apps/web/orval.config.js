/* eslint-disable */
module.exports = {
    "main": {
        input: './src/shared/api/schema.yaml',
        output: {
            target: './src/shared/api/generated.ts',
            prettier: true,
            override: {
                mutator: {
                    path: './src/shared/api/api-instace.ts',
                    name: 'createInstance'
                }
            }
        }
    }
}