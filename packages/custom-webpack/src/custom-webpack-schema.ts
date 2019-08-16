import { CustomWebpackBuilderConfig } from './custom-webpack-builder-config';
import { BrowserBuilderOptions, KarmaBuilderOptions, ServerBuilderOptions, DevServerBuilderOptions } from '@angular-devkit/build-angular';
import { BuilderContext } from '@angular-devkit/architect';
import { Transforms } from './transforms';

export type IndexTransformFile = string;
export interface IndexTransformFunction {
    (indexHtml: string, builderContext: BuilderContext, buildOptions: CustomWebpackBuildSchema): string | Promise<string>;
}
export type IndexTransform = IndexTransformFile | IndexTransformFunction;

export interface CustomWebpackSchema {
    customWebpackConfig: CustomWebpackBuilderConfig;
    // index transform filename exporting IndexHtmlTransform or directly a IndexHtmlTransform
    indexTransform?: IndexTransform | IndexTransform[];
    indexTransforms?: Transforms;
}


// We define this types here to avoid circular dependencies. Would have been nicer in browser/index.ts, ...
export type CustomWebpackBrowserSchema = BrowserBuilderOptions & CustomWebpackSchema;

export type CustomWebpackKarmaBuildSchema = KarmaBuilderOptions & CustomWebpackSchema;
export type CustomWebpackServerSchema = ServerBuilderOptions & CustomWebpackSchema;
export type CustomWebpackDevServerSchema = DevServerBuilderOptions & CustomWebpackSchema;



export type CustomWebpackBuildSchema = CustomWebpackBrowserSchema | CustomWebpackServerSchema | CustomWebpackKarmaBuildSchema | CustomWebpackDevServerSchema;
