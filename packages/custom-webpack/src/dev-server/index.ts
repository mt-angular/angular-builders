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
import { json } from '@angular-devkit/core';


export const serveCustomWebpackBrowser = (options: DevServerBuilderOptions, context: BuilderContext): Observable<DevServerBuilderOutput> => {
    async function setup() {
        const browserTarget = targetFromTargetString(options.browserTarget);
        // return context.getTargetOptions(browserTarget) as unknown as CustomWebpackDevServerSchema;

        // INSPIRED FROM angular-cli/packages/angular_devkit/build_angular/src/dev-server/index.ts
        // Get the browser configuration from the target name.
        const rawBrowserOptions = await context.getTargetOptions(browserTarget) as CustomWebpackDevServerSchema;
        const opt = { ...options };

        // In dev server we should not have budgets because of extra libs such as socks-js
        opt.budgets = undefined;

        /* 
        NOT WORKING
        const browserName = await context.getBuilderNameForTarget(browserTarget);
        const browserOptions = await context.validateOptions<json.JsonObject & CustomWebpackDevServerSchema>(
            { ...rawBrowserOptions, ...opt },
            browserName,
        ); */

        return { ...rawBrowserOptions, ...opt }; // browserOptions;

    }

    return from(setup())
        .pipe(switchMap(customWebpackOptions => executeDevServerBuilder(options, context, getTransforms(customWebpackOptions, context))));
};

export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(serveCustomWebpackBrowser);
