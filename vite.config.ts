import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
    plugins: [
        react(),
        ...(command === 'build' ? [dts({
            include: ['lib'],
            insertTypesEntry: true,
        })] : []),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            name: 'KnawHucBlocks',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@knaw-huc/panoptes-react',
                '@tanstack/react-router',
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'ReactJSXRuntime',
                    '@knaw-huc/panoptes-react': 'PanoptesReact',
                    '@tanstack/react-router': 'TanStackReactRouter',
                },
            },
        },
        cssCodeSplit: false,
    },
}));
