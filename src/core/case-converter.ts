"use strict";

import { toCamelCase, toKebabCase, toPascalCase, toSentenceCase, toSnakeCase, toTitleCase } from "../utils/case.js";
import { Processor } from "./processor.js";

export class CaseConverter extends Processor {

    constructor(isPreprocessor: boolean = false) {
        super('case', isPreprocessor);

        this.registerFunction({
            name: 'camel',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['camelcase'],
            processors: [toCamelCase],
            desc: 'Convert string to camelcase',
        });

        this.registerFunction({
            name: 'kebab',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['kebabcase'],
            processors: [toKebabCase],
        });
        this.registerFunction({
            name: 'lower',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['lowercase'],
            processors: [(value: string) => value.toLowerCase()],
        });
        this.registerFunction({
            name: 'pascal',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['pascalcase'],
            processors: [toPascalCase],
        });
        this.registerFunction({
            name: 'sentence',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['sentencecase'],
            processors: [toSentenceCase],
        });
        this.registerFunction({
            name: 'snake',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['snakecase'],
            processors: [toSnakeCase],
        });
        this.registerFunction({
            name: 'title',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['titlecase'],
            processors: [toTitleCase],
        });
        this.registerFunction({
            name: 'upper',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['uppercase'],
            processors: [(value: string) => value.toUpperCase()],
        });
    }
}