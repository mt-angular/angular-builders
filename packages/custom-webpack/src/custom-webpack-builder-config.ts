import { MergeStrategy } from "webpack-merge";

export type MergeStrategies = { [field: string]: MergeStrategy };

export class CustomWebpackBuilderConfig {
    path?: string = 'webpack.config.js';
    mergeStrategies?: MergeStrategies = {};
    replaceDuplicatePlugins?: boolean = false;
}
