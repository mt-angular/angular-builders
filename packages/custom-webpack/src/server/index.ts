/**
 * Created by Evgeny Barabanov on 28/06/2018.
 */

import { BuilderContext } from '@angular-devkit/architect';
import { ServerBuilder } from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
// import {NormalizedServerBuilderServerSchema} from '@angular-devkit/build-angular/src/server/schema';
import { CustomWebpackBuilder, NormalizedCustomWebpackServerBuildSchema } from "../custom-webpack-builder";
// import {CustomWebpackSchema} from "../custom-webpack-schema";

/* export interface NormalizedCustomWebpackServerBuildSchema extends NormalizedServerBuilderServerSchema, CustomWebpackSchema {
}
 */
export class CustomWebpackServerBuilder extends ServerBuilder {

    constructor(public context: BuilderContext) {
        super(context);
    }

    buildWebpackConfig(root: Path,
        projectRoot: Path,
        host: virtualFs.Host<fs.Stats>,
        options: NormalizedCustomWebpackServerBuildSchema): any {

        const serverWebpackConfig = super.buildWebpackConfig(root, projectRoot, host, options);
        const builderParameters = { root, projectRoot, host, options, browserBuilderInstance: this };

        return CustomWebpackBuilder.buildWebpackConfig(builderParameters, serverWebpackConfig) as any;
    }
}

export default CustomWebpackServerBuilder;
