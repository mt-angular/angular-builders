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
// import { CustomWebpackSchema } from '../custom-webpack-schema';

/* export interface NormalizedCustomWebpackKarmaBuildSchema extends NormalizedKarmaBuilderSchema, CustomWebpackSchema {
}
 */

export class CustomWebpackKarmaBuilder extends KarmaBuilder {

    constructor(context: BuilderContext) {
        super(context);
    }

    buildWebpackConfig(root: Path,
        projectRoot: Path,
        sourceRoot: Path,
        host: virtualFs.Host<fs.Stats>,
        buildOptions: NormalizedCustomWebpackKarmaBuildSchema): Configuration {

        const baseWebpackConfig = super.buildWebpackConfig(root, projectRoot, host, buildOptions);
        const builderParameters = { root, projectRoot, host, buildOptions, baseWebpackConfig };

        return CustomWebpackBuilder.buildWebpackConfig(builderParameters, baseWebpackConfig);
    }
}

export default CustomWebpackKarmaBuilder;
