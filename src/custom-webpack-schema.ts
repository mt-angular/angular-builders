import { CustomWebpackBuilderConfig } from './custom-webpack-builder-config';
import { BrowserBuilderOptions, KarmaBuilderOptions, ServerBuilderOptions, DevServerBuilderOptions } from '@angular-devkit/build-angular';

export interface CustomWebpackSchema {
    customWebpackConfig: CustomWebpackBuilderConfig;
    indexTransform?: string;
}


// We define this types here to avoid circular dependencies. Would have been nicer in browser/index.ts, ...
export type CustomWebpackBrowserSchema = BrowserBuilderOptions & CustomWebpackSchema;

export type CustomWebpackKarmaBuildSchema = KarmaBuilderOptions & CustomWebpackSchema;
export type CustomWebpackServerSchema = ServerBuilderOptions & CustomWebpackSchema;
export type CustomWebpackDevServerSchema = DevServerBuilderOptions & CustomWebpackSchema;



export type CustomWebpackBuildSchema = CustomWebpackBrowserSchema | CustomWebpackServerSchema | CustomWebpackKarmaBuildSchema | CustomWebpackDevServerSchema;
