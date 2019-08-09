import { CustomWebpackBuilder, BuilderParameters } from './custom-webpack-builder';
import { MergeStrategies, CustomWebpackBuilderConfig } from './custom-webpack-builder-config';
jest.mock('./webpack-config-merger');
import { WebpackConfigMerger } from './webpack-config-merger';
import { Path } from '@angular-devkit/core';



const customWebpackConfiguration = {
    module: {
        rules: [
            {
                test: '.node',
                use: 'node-loader'
            }
        ]
    },
};

const getWebpackConfig = CustomWebpackBuilder.getWebpackConfig = jest.fn().mockReturnValue(customWebpackConfiguration);


const defaultWebpackConfigPath = new CustomWebpackBuilderConfig().path;

const baseWebpackConfig = {
    entry: 'blah'
};



function builderParameters(): BuilderParameters {
    return {
        root: __dirname as Path,
        host: undefined,
        options: { customWebpackConfig: {} } as any,
        projectRoot: undefined,
        webpackConfiguration: { entry: 'index.js' }
    };
}

/* function createConfigFile(fileName: string) {
    jest.mock(`${__dirname}/${fileName}`, () => customWebpackConfiguration, { virtual: true });
} */


describe('CustomWebpackBuilder test', () => {
    let param: BuilderParameters;

    beforeEach(() => {
        param = builderParameters();
    });

    it('Should load webpack.config.js if no path specified', () => {
        const fileName = defaultWebpackConfigPath;
        // createConfigFile(fileName);
        CustomWebpackBuilder.buildWebpackConfig(param, baseWebpackConfig);

        expect(CustomWebpackBuilder.getWebpackConfig).toHaveBeenCalledWith(param.root, fileName);
        expect(CustomWebpackBuilder.getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(WebpackConfigMerger.merge).toHaveBeenCalledWith(baseWebpackConfig, customWebpackConfiguration, {}, false);
    });

    it('Should load the file specified in configuration', () => {
        const fileName = 'extra-webpack.config.js';
        Object.assign(param.options.customWebpackConfig, { path: fileName });
        CustomWebpackBuilder.buildWebpackConfig(param, baseWebpackConfig);

        expect(CustomWebpackBuilder.getWebpackConfig).toHaveBeenCalledWith(param.root, fileName);
        expect(CustomWebpackBuilder.getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(WebpackConfigMerger.merge).toHaveBeenCalledWith(baseWebpackConfig, customWebpackConfiguration, {}, false);
    });

    it('Should pass on function return from webpack config', () => {
        getWebpackConfig.mockReturnValueOnce(() => customWebpackConfiguration);

        const fileName = defaultWebpackConfigPath;
        Object.assign(param.options.customWebpackConfig, { path: fileName, replaceDuplicatePlugins: true });

        CustomWebpackBuilder.buildWebpackConfig(param, baseWebpackConfig);

        expect(getWebpackConfig).toHaveBeenCalledWith(param.root, fileName);
        expect(getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(WebpackConfigMerger.merge).toHaveBeenCalledWith(baseWebpackConfig, customWebpackConfiguration, {}, true);
    });

    it('Should pass on merge strategies', () => {
        const fileName = defaultWebpackConfigPath;
        const mergeStrategies: MergeStrategies = { blah: 'prepend' };
        Object.assign(param.options.customWebpackConfig, { path: fileName, mergeStrategies });

        CustomWebpackBuilder.buildWebpackConfig(param, baseWebpackConfig);

        expect(CustomWebpackBuilder.getWebpackConfig).toHaveBeenCalledWith(param.root, fileName);
        expect(CustomWebpackBuilder.getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(WebpackConfigMerger.merge).toHaveBeenCalledWith(baseWebpackConfig, customWebpackConfiguration, mergeStrategies, false);
    });

    it('Should pass on replaceDuplicatePlugins flag', () => {
        const fileName = defaultWebpackConfigPath;
        Object.assign(param.options.customWebpackConfig, { path: fileName, replaceDuplicatePlugins: true });

        CustomWebpackBuilder.buildWebpackConfig(param, baseWebpackConfig);

        expect(CustomWebpackBuilder.getWebpackConfig).toHaveBeenCalledWith(param.root, fileName);
        expect(CustomWebpackBuilder.getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(WebpackConfigMerger.merge).toHaveBeenCalledWith(baseWebpackConfig, customWebpackConfiguration, {}, true);
    });

});
