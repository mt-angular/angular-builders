/**
 * Created by Evgeny Barabanov on 28/06/2018.
 * Modified by Thomas Milotti on 25/12/2018
 */

import { BuilderContext } from '@angular-devkit/architect';
import { BrowserBuilder } from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
// import { CustomWebpackSchema } from "../custom-webpack-schema";
import { CustomWebpackBuilder, NormalizedCustomWebpackBrowserBuildSchema } from '../custom-webpack-builder';
import { Configuration } from 'webpack';

/* export interface NormalizedCustomWebpackBrowserBuildSchema extends NormalizedBrowserBuilderSchema, CustomWebpackSchema {
}
 */



export class CustomWebpackBrowserBuilder extends BrowserBuilder {

    constructor(context: BuilderContext) {
        super(context);
    }

    buildWebpackConfig(root: Path,
        projectRoot: Path,
        host: virtualFs.Host<fs.Stats>,
        options: NormalizedCustomWebpackBrowserBuildSchema): Configuration {

        const webpackConfiguration = super.buildWebpackConfig(root, projectRoot, host, options);
        const builderParameters = { root, projectRoot, host, options, webpackConfiguration };

        return CustomWebpackBuilder.buildWebpackConfig(builderParameters, webpackConfiguration);
    }
}

export default CustomWebpackBrowserBuilder;
