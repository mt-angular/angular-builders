import { CustomWebpackBuilderConfig } from './custom-webpack-builder-config';
import { NormalizedBrowserBuilderSchema, NormalizedKarmaBuilderSchema } from '@angular-devkit/build-angular';
import { NormalizedServerBuilderServerSchema } from '@angular-devkit/build-angular/src/server/schema';

export interface CustomWebpackSchema {
    customWebpackConfig: CustomWebpackBuilderConfig;
}


export interface NormalizedCustomWebpackBrowserBuildSchema extends NormalizedBrowserBuilderSchema, CustomWebpackSchema { }
export interface NormalizedCustomWebpackKarmaBuildSchema extends NormalizedKarmaBuilderSchema, CustomWebpackSchema { }
export interface NormalizedCustomWebpackServerBuildSchema extends NormalizedServerBuilderServerSchema, CustomWebpackSchema { }


export type BuilderParametersOptions = NormalizedCustomWebpackBrowserBuildSchema | NormalizedCustomWebpackKarmaBuildSchema | NormalizedCustomWebpackServerBuildSchema;
