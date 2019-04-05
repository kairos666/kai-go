import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// https://stenciljs.com/docs/config

export const config: Config = {
    globalStyle: 'src/global/app.css',
    globalScript: 'src/global/app.ts',
    outputTargets: [
        {
            type: 'www',
            serviceWorker: null
        }
    ],
    plugins: [
        sass({ injectGlobalPaths: [
            'src/global/styles/variables.scss',
            'src/global/styles/utils.scss'
        ]})
    ]
};
