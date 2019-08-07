jest.mock('../src/webpack-config-merger');
import { mergeConfigs } from '../src/webpack-config-merger';
import { BuilderContext } from '@angular-devkit/architect';
import { CustomWebpackBuilder, BuilderParameters } from '../src/custom-webpack-builder';
import { CustomWebpackBuilderConfig, MergeStrategies } from '../src/custom-webpack-builder-config';



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

const baseWebpackConf = {
    entry: 'blah'
};


interface BuildParameterArgs {
    baseWebpackConfig?: {};
    customWebpackConfig?: CustomWebpackBuilderConfig;
}

function builderParameters({ baseWebpackConfig = baseWebpackConf, customWebpackConfig }: BuildParameterArgs = {}): BuilderParameters {
    return {
        builderContext: { workspaceRoot: __dirname } as BuilderContext,
        buildOptions: { customWebpackConfig } as any,
        baseWebpackConfig
    };
}

/* function createConfigFile(fileName: string) {
    jest.mock(`${__dirname}/${fileName}`, () => customWebpackConfiguration, { virtual: true });
} */

function buildWebpackConfig(param: BuilderParameters) {
    CustomWebpackBuilder.buildWebpackConfig(param.builderContext, param.buildOptions, param.baseWebpackConfig);
}


describe('CustomWebpackBuilder test', () => {

    it('Should load webpack.config.js if no path specified', () => {
        const param = builderParameters();

        const fileName = defaultWebpackConfigPath;
        // createConfigFile(fileName);
        buildWebpackConfig(param);

        expect(getWebpackConfig).toHaveBeenCalledWith(param.builderContext.workspaceRoot, fileName);
        expect(getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(mergeConfigs).toHaveBeenCalledWith(param.baseWebpackConfig, customWebpackConfiguration, {}, false);
    });

    it('Should load the file specified in configuration', () => {
        const fileName = 'extra-webpack.config.js';
        const param = builderParameters({ customWebpackConfig: { path: fileName }, baseWebpackConfig: { ...baseWebpackConf } });

        buildWebpackConfig(param);

        expect(CustomWebpackBuilder.getWebpackConfig).toHaveBeenCalledWith(param.builderContext.workspaceRoot, fileName);
        expect(CustomWebpackBuilder.getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(mergeConfigs).toHaveBeenCalledWith(param.baseWebpackConfig, customWebpackConfiguration, {}, false);
    });

    it('Should pass on function return from webpack config', () => {
        const fileName = defaultWebpackConfigPath;
        const param = builderParameters({ customWebpackConfig: { path: fileName, replaceDuplicatePlugins: true } });

        buildWebpackConfig(param);

        expect(getWebpackConfig).toHaveBeenCalledWith(param.builderContext.workspaceRoot, fileName);
        expect(getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(mergeConfigs).toHaveBeenCalledWith(param.baseWebpackConfig, customWebpackConfiguration, {}, true);
    });

    it('Should pass on merge strategies', () => {
        const fileName = defaultWebpackConfigPath;
        const mergeStrategies: MergeStrategies = { blah: 'prepend' };

        const param = builderParameters({ customWebpackConfig: { path: fileName, mergeStrategies }, baseWebpackConfig: { ...baseWebpackConf } });

        buildWebpackConfig(param);

        expect(getWebpackConfig).toHaveBeenCalledWith(param.builderContext.workspaceRoot, fileName);
        expect(getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(mergeConfigs).toHaveBeenCalledWith(param.baseWebpackConfig, customWebpackConfiguration, mergeStrategies, false);
    });

    it('Should pass on replaceDuplicatePlugins flag', () => {
        const fileName = defaultWebpackConfigPath;
        const param = builderParameters({ customWebpackConfig: { path: fileName, replaceDuplicatePlugins: true } });

        buildWebpackConfig(param);

        expect(getWebpackConfig).toHaveBeenCalledWith(param.builderContext.workspaceRoot, fileName);
        expect(getWebpackConfig).toHaveReturnedWith(customWebpackConfiguration);
        expect(mergeConfigs).toHaveBeenCalledWith(param.baseWebpackConfig, customWebpackConfiguration, {}, true);
    });

});
