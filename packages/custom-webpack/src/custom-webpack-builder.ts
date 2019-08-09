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

export type ReturnWebpackConfiguration = { configuration: Configuration; override?: boolean };
export type FunctionWebpackConfiguration = (BuilderParameters: BuilderParameters) => Configuration | ReturnWebpackConfiguration;
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
        if (CustomWebpackBuilder.isConfigurationFunction(customWebpackConfigExport)) {
            const webpackConfig = customWebpackConfigExport({ builderContext, buildOptions, baseWebpackConfig });

            if (CustomWebpackBuilder.isOverrideConfiguration(webpackConfig)) {
                if (webpackConfig.override)
                    return webpackConfig.configuration;

                customWebpackConfig = webpackConfig.configuration;
            } else
                customWebpackConfig = webpackConfig;
        } else
            customWebpackConfig = customWebpackConfigExport;


        return mergeConfigs(baseWebpackConfig, customWebpackConfig, config.mergeStrategies, config.replaceDuplicatePlugins);
    }

    static isOverrideConfiguration(returnWebpackConfig: Configuration | ReturnWebpackConfiguration): returnWebpackConfig is ReturnWebpackConfiguration {
        return (returnWebpackConfig as any).configuration;
    }

    static isConfigurationFunction(configuration: WebpackConfiguration): configuration is FunctionWebpackConfiguration {
        return typeof configuration === 'function';
    }

    static getWebpackConfig(root: string, relativeWebpackConfigPath: string): WebpackConfiguration {
        return require(`${getSystemPath(root as Path)}/${relativeWebpackConfigPath}`);
    }
}
