"use strict";

import { CaseConverter } from "./case-converter.js";
import { CastingMap } from "./castingmap.js";

const castings = CastingMap.init();

castings.register('trim', (value) => {
    return typeof value === 'string' ? value.trim() : value;
});

// Type casting rules
castings.register('type::integer', (value) => parseInt(value, 10), ['integer', 'int']);

castings.register('type::float', (value) => parseFloat(value), ['float','double']);

castings.register('type::boolean', (value) => {
    value = 'string' === typeof value ? (value || '').toLowerCase() : value;
    return ['0', 'false'].includes(value) ? false : Boolean(value);
}, ['boolean', 'bool']);

// Case conversion rules
castings.register('case::lower', (value) => {
    return CaseConverter.toLowerCase(value);
}, ['lowercase', 'lower']);

castings.register('case::upper', (value) => {
    return CaseConverter.toUpperCase(value);
}, ['uppercase', 'upper']);

castings.register('case::snake', (value) => {
    return CaseConverter.toSnakeCase(value);
}, ['snakecase', 'snake']);

castings.register('case::kebab', (value) => {
    return CaseConverter.toKebabCase(value);
}, ['kebabcase', 'kebab']);

castings.register('case::camel', (value) => {
    return CaseConverter.toCamelCase(value);
}, ['camelcase', 'camel']);

castings.register('case::pascal', (value) => {
    return CaseConverter.toPascalCase(value);
}, ['pascalcase', 'pascal']);

castings.register('case::title', (value) => {
    return CaseConverter.toTitleCase(value);
}, ['titlecase', 'title', 'word', 'wordcase']);

/**
 * Register custom casting rule
 * @param {string} name Casting rule name
 * @param {function(string):any} callback Callback function to cast raw field value
 */
export function registerCasting(name, callback) {
	castings.register(name, callback);
}

export { castings }