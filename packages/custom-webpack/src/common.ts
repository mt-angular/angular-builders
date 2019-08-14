
import { BuilderContext, Target } from '@angular-devkit/architect';
import { ExecutionTransformer } from '@angular-devkit/build-angular';
import { normalize, getSystemPath, Path } from '@angular-devkit/core';
import { Configuration } from 'webpack';
import { CustomWebpackBuilder } from './custom-webpack-builder';
import { IndexHtmlTransform } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/write-index-html';
import { CustomWebpackBuildSchema, IndexTransform } from './custom-webpack-schema';



export function customWebpackConfigTransformFactory(options: CustomWebpackBuildSchema, context: BuilderContext): ExecutionTransformer<Configuration> {
    return baseWebpackConfig => CustomWebpackBuilder.buildWebpackConfig(
        { ...context, workspaceRoot: normalize(context.workspaceRoot) },
        options,
        baseWebpackConfig,
    );
}



export function indexHtmlTransformFactory(options: CustomWebpackBuildSchema, context: BuilderContext): IndexHtmlTransform {

    // index-html-transform.js path
    const indexHtmlOuput = options.indexTransform;
    if (!indexHtmlOuput) return null;

    const { workspaceRoot, target } = context;

    let transform: IndexTransform = undefined;

    if (typeof indexHtmlOuput === 'string')
        transform = getIndexTransform(normalize(workspaceRoot), indexHtmlOuput);
    else
        transform = indexHtmlOuput;


    return async (indexHtml: string) => transform(
        indexHtml,
        {
            ...context, workspaceRoot: normalize(context.workspaceRoot)
        },
        options);
    // target, indexHtml);
}



function getIndexTransform(root: string, indexTransformPath: string): IndexTransform {
    return require(`${getSystemPath(root as Path)}/${indexTransformPath}`);
}


export function getTransforms(options: CustomWebpackBuildSchema, context: BuilderContext) {
    return {
        webpackConfiguration: customWebpackConfigTransformFactory(options, context),
        indexHtml: indexHtmlTransformFactory(options, context)
    };
}
