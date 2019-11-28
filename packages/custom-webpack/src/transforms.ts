import { CustomWebpackBuildSchema, IndexTransform, CustomWebpackBuilder, IndexTransformFunction } from '.';
import { BuilderContext } from '@angular-devkit/architect';
import { normalize, join } from 'path';
import { Configuration } from 'webpack';
import { getSystemPath, Path } from '@angular-devkit/core';

function getIndexTransform(root: string, indexTransformPath: string): IndexTransformFunction {
    const content = require(join(getSystemPath(root as Path), indexTransformPath));
    return (indexHtml: string, builderContext: BuilderContext, buildOptions: CustomWebpackBuildSchema) => content;
}

export class Transforms {
    private _indexHtml: (indexHtmlContent: string) => Promise<string> = (indexHtmlContent: string) => Promise.resolve(indexHtmlContent);

    constructor(public options: CustomWebpackBuildSchema, public context: BuilderContext) {
        context.workspaceRoot = normalize(this.context.workspaceRoot);
        this.initIndexHtml();
        this.options.indexTransforms = this;
    }


    private initIndexHtml() {
        const indexHtmlOuput = this.options.indexTransform;
        if (!indexHtmlOuput) return;

        const transforms: IndexTransform[] = Array.isArray(indexHtmlOuput) ? indexHtmlOuput : [ indexHtmlOuput ];
        for (const transform of transforms)
            this.addIndexTransform(transform);
    }


    webpackConfiguration(baseWebpackConfig: Configuration): Configuration {
        return CustomWebpackBuilder.buildWebpackConfig(this.context, this.options, baseWebpackConfig);
    }

    indexHtml(indexHtmlContent: string): Promise<string> {
        return this._indexHtml(indexHtmlContent);
    }

    addIndexTransform(transform: IndexTransform) {
        const transformFunc = this.getTransformFunc(transform);
        const oldIndexHtml = this._indexHtml;

        this._indexHtml = async  (indexHtmlContent: string) => {
            const content = await oldIndexHtml(indexHtmlContent);
            return transformFunc(content, this.context, this.options);
        };
    }

    private getTransformFunc(transform: IndexTransform): IndexTransformFunction {
        const { workspaceRoot } = this.context;
        const transformFunc = typeof transform === 'string' ? getIndexTransform(normalize(workspaceRoot), transform) : transform;

        return transformFunc;
    }
}
