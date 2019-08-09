/**
 * Created by Evgeny Barabanov on 28/06/2018.
 * Modified by Thomas Milotti on 25/12/2018
 */

import { BuilderContext } from '@angular-devkit/architect';
import { ServerBuilder } from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
import { CustomWebpackBuilder } from '../custom-webpack-builder';
import { Configuration } from 'webpack';
import { NormalizedCustomWebpackServerBuildSchema } from '../custom-webpack-schema';

export class CustomWebpackServerBuilder extends ServerBuilder {
    constructor(private builderContext: BuilderContext) {
        super(builderContext);
    }

    buildWebpackConfig(root: Path,
        projectRoot: Path,
        host: virtualFs.Host<fs.Stats>,
        buildOptions: NormalizedCustomWebpackServerBuildSchema): Configuration {

        const baseWebpackConfig = super.buildWebpackConfig(root, projectRoot, host, buildOptions);
        const builderParameters = { root, projectRoot, host, builderContext: this.builderContext, buildOptions, baseWebpackConfig };

        return CustomWebpackBuilder.buildWebpackConfig(builderParameters);
    }
}

export default CustomWebpackServerBuilder;
