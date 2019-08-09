

const buildWebpackConfigMock = jest.fn();

jest.mock('../custom-webpack-builder', () => ({
    CustomWebpackBuilder: {
        buildWebpackConfig: buildWebpackConfigMock,
    }
}));

import { normalize } from '@angular-devkit/core';
import { CustomWebpackKarmaBuilder } from '.';
import { NormalizedCustomWebpackKarmaBuildSchema, BuilderParameters } from '../custom-webpack-builder';
import { KarmaBuilder } from '@angular-devkit/build-angular';


const commonConfig = { common: 1 };
const stylesConfig = { styles: 2 };
const nonAotTestConfig = { nonAotTest: 3 };
const testConfig = { test: 4 };

const angularConfigs = { common: 1, styles: 2, nonAotTest: 3, test: 4 };


// Mock angular configs to avoid unnecessary computations and sandbox the test
jest.mock('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs', () => ({
    getCommonConfig: () => commonConfig,
    getStylesConfig: () => stylesConfig,
    getNonAotTestConfig: () => nonAotTestConfig,
    getTestConfig: () => testConfig,
}));



describe('Custom webpack karma builder test', () => {
    let builder: CustomWebpackKarmaBuilder;

    beforeEach(() => {
        KarmaBuilder.prototype.buildWebpackConfig = jest.fn().mockReturnValue(angularConfigs);
        builder = new CustomWebpackKarmaBuilder({} as any);
    });

    it('Should merge custom webpack config with the default one', () => {

        const customConfig = { prop: 'What a cool config' };
        const mergedConfig = { ...angularConfigs, ...customConfig };
        const buildOptions = { customWebpackConfig: { path: 'custom.webpack.js' }, tsConfig: 'blah' } as NormalizedCustomWebpackKarmaBuildSchema;

        buildWebpackConfigMock.mockReturnValue(mergedConfig);

        const root = normalize(`${__dirname}/../../../../`);
        const projectRoot = root;
        const sourceRoot = normalize('./');
        const host = {} as any;
        const baseWebpackConfig = angularConfigs;

        const param = { root, sourceRoot, projectRoot, host, buildOptions, builderContext: builder.context, baseWebpackConfig } as BuilderParameters;
        const config = builder.buildWebpackConfig(param.root, param.projectRoot, param.sourceRoot, param.host, param.buildOptions as any);

        expect(buildWebpackConfigMock).toHaveBeenCalledWith(param);

        expect(config).toEqual(mergedConfig);
    });
});
