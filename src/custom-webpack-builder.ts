import { CustomWebpackBuilderConfig } from './custom-webpack-builder-config';
import { Configuration } from 'webpack';
import { getSystemPath, Path } from '@angular-devkit/core';
import { mergeConfigs } from './webpack-config-merger';
import { BuilderContext } from '@angular-devkit/architect';
import { CustomWebpackBuildSchema } from './custom-webpack-schema';



export interface BuilderParameters {
    builderContext: BuilderContext;
    buildOptions: CustomWebpackBuildSchema;

    baseWebpackConfig: Configuration;
}

export type FunctionWebpackConfiguration = (BuilderParameters: BuilderParameters) => Configuration;
export type WebpackConfiguration = Configuration | FunctionWebpackConfiguration;


export class CustomWebpackBuilder {
    static buildWebpackConfig(builderContext: BuilderContext, buildOptions: CustomWebpackBuildSchema, baseWebpackConfig: Configuration): Configuration {

        if (!buildOptions) {
            return baseWebpackConfig;
        }

        const config = buildOptions.customWebpackConfig = Object.assign(new CustomWebpackBuilderConfig(), buildOptions.customWebpackConfig);
        const webpackConfigPath = config.path;

        const customWebpackConfigExport = CustomWebpackBuilder.getWebpackConfig(builderContext.workspaceRoot, webpackConfigPath);
        let customWebpackConfig: Configuration = undefined;

        // call the function if the module export a function, otherwise, just keep the config object
        if (CustomWebpackBuilder.isConfigurationFunction(customWebpackConfigExport))
            customWebpackConfig = customWebpackConfigExport({ builderContext, buildOptions, baseWebpackConfig });
        else
            customWebpackConfig = customWebpackConfigExport;


        return mergeConfigs(baseWebpackConfig, customWebpackConfig, config.mergeStrategies, config.replaceDuplicatePlugins);
    }

    static isConfigurationFunction(configuration: WebpackConfiguration): configuration is FunctionWebpackConfiguration {
        return typeof configuration === 'function';
    }

    static getWebpackConfig(root: string, relativeWebpackConfigPath: string): WebpackConfiguration {
        return require(`${getSystemPath(root as Path)}/${relativeWebpackConfigPath}`);
    }
}
