/**
 * Created by Evgeny Barabanov on 28/06/2018.
 * Modified by Thomas Milotti on 25/12/2018
 */


import { BuilderContext, createBuilder, targetFromTargetString } from '@angular-devkit/architect';
import { DevServerBuilderOptions, DevServerBuilderOutput, executeDevServerBuilder } from '@angular-devkit/build-angular';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getTransforms } from '../common';
import { CustomWebpackDevServerSchema } from '../custom-webpack-schema';


export const serveCustomWebpackBrowser = (options: DevServerBuilderOptions, context: BuilderContext): Observable<DevServerBuilderOutput> => {
    async function setup() {
        const browserTarget = targetFromTargetString(options.browserTarget);
        return context.getTargetOptions(browserTarget) as unknown as CustomWebpackDevServerSchema;
    }

    return from(setup())
        .pipe(switchMap(customWebpackOptions => executeDevServerBuilder(options, context, getTransforms(customWebpackOptions, context))));
}

export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(serveCustomWebpackBrowser);
