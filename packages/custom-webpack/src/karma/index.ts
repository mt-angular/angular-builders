/**
 * Created by Evgeny Barabanov on 05/10/2018.
 * Modified by Thomas Milotti on 25/12/2018
 */

import { BuilderContext } from '@angular-devkit/architect';
import { KarmaBuilder } from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
import { CustomWebpackBuilder, NormalizedCustomWebpackKarmaBuildSchema } from '../custom-webpack-builder';
import { Configuration } from 'webpack';

export class CustomWebpackKarmaBuilder extends KarmaBuilder {

    constructor(private builderContext: BuilderContext) {
        super(builderContext);
    }

    buildWebpackConfig(root: Path,
        projectRoot: Path,
        sourceRoot: Path,
        host: virtualFs.Host<fs.Stats>,
        buildOptions: NormalizedCustomWebpackKarmaBuildSchema): Configuration {

        const baseWebpackConfig = super.buildWebpackConfig(root, projectRoot, sourceRoot, host, buildOptions);
        const builderParameters = { root, projectRoot, sourceRoot, host, builderContext: this.builderContext, buildOptions, baseWebpackConfig };

        return CustomWebpackBuilder.buildWebpackConfig(builderParameters);
    }
}

export default CustomWebpackKarmaBuilder;
