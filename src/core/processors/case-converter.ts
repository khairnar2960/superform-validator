"use strict";

import { toCamelCase, toCapitalize, toKebabCase, toPascalCase, toSentenceCase, toSnakeCase, toTitleCase, ucFirst } from "../../utils/case.js";
import { Processor } from "./processor.js";

export class CaseConverter extends Processor {

    constructor(isPreprocessor: boolean = false) {
        super('case', isPreprocessor);

        this.registerFunction({
            name: 'camel',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toCamelcase'],
            processors: [toCamelCase],
            desc: 'Convert string to camelcase',
        });

        this.registerFunction({
            name: 'kebab',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toKebabcase'],
            processors: [toKebabCase],
        });
        this.registerFunction({
            name: 'lower',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toLowercase'],
            processors: [(value: string) => value.toLowerCase()],
        });
        this.registerFunction({
            name: 'pascal',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toPascalcase'],
            processors: [toPascalCase],
        });
        this.registerFunction({
            name: 'sentence',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toSentencecase'],
            processors: [toSentenceCase],
        });
        this.registerFunction({
            name: 'snake',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toSnakecase'],
            processors: [toSnakeCase],
        });
        this.registerFunction({
            name: 'title',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toTitlecase'],
            processors: [toTitleCase],
        });
        this.registerFunction({
            name: 'upper',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toUppercase'],
            processors: [(value: string) => value.toUpperCase()],
        });
        this.registerFunction({
            name: 'ucFirst',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toUcFirst'],
            processors: [ucFirst],
        });
        this.registerFunction({
            name: 'capitalize',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toCapitalize'],
            processors: [toCapitalize],
        });
    }
}