/**
 * Created by Evgeny Barabanov on 05/10/2018.
 * Modified by Thomas Milotti on 25/12/2018
 */


import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { executeKarmaBuilder } from '@angular-devkit/build-angular';
import { json } from '@angular-devkit/core';
import { customWebpackConfigTransformFactory } from '../common';
import { CustomWebpackKarmaBuildSchema } from '../custom-webpack-schema';
import { Observable } from 'rxjs';


export function buildCustomWebpackKarma(options: CustomWebpackKarmaBuildSchema, context: BuilderContext): Observable<BuilderOutput> {
    return executeKarmaBuilder(options, context, {
        webpackConfiguration: customWebpackConfigTransformFactory(options, context)
    });
}

export default createBuilder<json.JsonObject & CustomWebpackKarmaBuildSchema>(buildCustomWebpackKarma);
