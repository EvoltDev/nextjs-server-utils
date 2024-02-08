import pkg from './package.json' assert { type: 'json' }
import swc from '@rollup/plugin-swc'
import nodeResolve from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'

export default defineConfig([
    {
        input: 'src/index.ts',
        external: ['next', 'nodemailer', '@aws-sdk/client-ses', 'zod'],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [
            swc(),
            nodeResolve({ extensions: ['.mjs', '.ts', '.json', '.js'] }),
        ],
    },
])
