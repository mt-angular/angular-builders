/**
 * Created by Evgeny Barabanov on 28/06/2018.
 * Modified by Thomas Milotti on 25/12/2018
 */

/* import { BuilderContext } from '@angular-devkit/architect';
import { BrowserBuilder } from '@angular-devkit/build-angular';

import { Path, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
import { CustomWebpackBuilder, NormalizedCustomWebpackBrowserBuildSchema } from '../custom-webpack-builder';
import { Configuration } from 'webpack';

 */


/* 
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
 */

import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular';
import { json } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { getTransforms } from '../common';
import { CustomWebpackBrowserSchema } from '../custom-webpack-schema';


export function buildCustomWebpackBrowser(options: CustomWebpackBrowserSchema, context: BuilderContext): Observable<BuilderOutput> {
    return executeBrowserBuilder(options, context, getTransforms(options, context));
}

export default createBuilder<json.JsonObject & CustomWebpackBrowserSchema>(buildCustomWebpackBrowser);
