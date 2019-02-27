import { CustomWebpackBuilderConfig } from './custom-webpack-builder-config';
import { Configuration } from 'webpack';
import { getSystemPath, Path, virtualFs } from '@angular-devkit/core';
import { BrowserBuilder, NormalizedBrowserBuilderSchema, NormalizedKarmaBuilderSchema, ServerBuilder, KarmaBuilder } from '@angular-devkit/build-angular';
import * as fs from 'fs';
import { WebpackConfigMerger } from './webpack-config-merger';
import { CustomWebpackSchema } from './custom-webpack-schema';
import { NormalizedServerBuilderServerSchema } from '@angular-devkit/build-angular/src/server/schema';


export interface NormalizedCustomWebpackBrowserBuildSchema extends NormalizedBrowserBuilderSchema, CustomWebpackSchema { }
export interface NormalizedCustomWebpackKarmaBuildSchema extends NormalizedKarmaBuilderSchema, CustomWebpackSchema { }
export interface NormalizedCustomWebpackServerBuildSchema extends NormalizedServerBuilderServerSchema, CustomWebpackSchema { }


export type BuilderParametersOptions = NormalizedCustomWebpackBrowserBuildSchema | NormalizedCustomWebpackKarmaBuildSchema | NormalizedCustomWebpackServerBuildSchema;

export interface BuilderParameters {
    root: Path;
    projectRoot: Path;
    sourceRoot?: Path;
    host: virtualFs.Host<fs.Stats>;
    options: BuilderParametersOptions;
    webpackConfiguration: Configuration;
    // browserBuilderInstance: BrowserBuilder | KarmaBuilder | ServerBuilder;
}

export type FunctionWebpackConfiguration = (BuilderParameters: BuilderParameters) => Configuration;
export type WebpackConfiguration = Configuration | FunctionWebpackConfiguration;

export class CustomWebpackBuilder {

    static buildWebpackConfig(builderParameters: BuilderParameters, baseWebpackConfig: Configuration): Configuration {

        const { root, options } = builderParameters;

        const config = options.customWebpackConfig = Object.assign(new CustomWebpackBuilderConfig(), options.customWebpackConfig);
        const webpackConfigPath = config.path;

        const customWebpackConfigExport = CustomWebpackBuilder.getWebpackConfig(root, webpackConfigPath);
        let customWebpackConfig: Configuration = undefined;

        // call the function if the module export a function, otherwise, just keep the config object
        if (CustomWebpackBuilder.isConfigurationFunction(customWebpackConfigExport))
            customWebpackConfig = customWebpackConfigExport(builderParameters);
        else
            customWebpackConfig = customWebpackConfigExport;


        return WebpackConfigMerger.merge(baseWebpackConfig, customWebpackConfig, config.mergeStrategies, config.replaceDuplicatePlugins);
    }

    static isConfigurationFunction(configuration: WebpackConfiguration): configuration is FunctionWebpackConfiguration {
        return typeof configuration === 'function';
    }

    // getWebpackConfig
    static getWebpackConfig(root: Path, relativeWebpackConfigPath: string): WebpackConfiguration {
        return require(`${getSystemPath(root)}/${relativeWebpackConfigPath}`);
    }
}

// CustomWebpackBuilder.buildWebpackConfig({ root: __dirname, options: { customWebpackConfig: undefined } } as any, undefined);
