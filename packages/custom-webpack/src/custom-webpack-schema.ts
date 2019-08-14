import { CustomWebpackBuilderConfig } from './custom-webpack-builder-config';
import { BrowserBuilderOptions, KarmaBuilderOptions, ServerBuilderOptions, DevServerBuilderOptions } from '@angular-devkit/build-angular';
import { BuilderContext } from '@angular-devkit/architect';

export type IndexTransformFile = string;
export interface IndexTransform {
    (indexHtml: string, builderContext: BuilderContext, buildOptions: CustomWebpackBuildSchema): string;
}


export interface CustomWebpackSchema {
    customWebpackConfig: CustomWebpackBuilderConfig;
    // index transform filename exporting IndexHtmlTransform or directly a IndexHtmlTransform
    indexTransform?: IndexTransformFile | IndexTransform;
}


// We define this types here to avoid circular dependencies. Would have been nicer in browser/index.ts, ...
export type CustomWebpackBrowserSchema = BrowserBuilderOptions & CustomWebpackSchema;

export type CustomWebpackKarmaBuildSchema = KarmaBuilderOptions & CustomWebpackSchema;
export type CustomWebpackServerSchema = ServerBuilderOptions & CustomWebpackSchema;
export type CustomWebpackDevServerSchema = DevServerBuilderOptions & CustomWebpackSchema;



export type CustomWebpackBuildSchema = CustomWebpackBrowserSchema | CustomWebpackServerSchema | CustomWebpackKarmaBuildSchema | CustomWebpackDevServerSchema;
