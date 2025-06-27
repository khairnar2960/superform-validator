"use strict";

export class CaseConverter {
    static toSnakeCase(input) {
        return input.replace(/(?<!^)[A-Z]/g, (char) => '_' + char).toLowerCase().replace(/\_?(\s+)\_?/g, '_');
    }

    static toKebabCase(input) {
        return input.replace(/(?<!^)[A-Z]/g, (char) => '-' + char).toLowerCase().replace(/\-?(\s+)\-?/g, '-');
    }

    static toCamelCase(input) {
        return input.replace(/\s+/g, ' ')
        .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
        .replace(/^(.)/, (_, char) => char.toLowerCase());
    }

    static toPascalCase(input) {
        return input.replace(/\s+/g, ' ')
        .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
        .replace(/^(.)/, (_, char) => char.toUpperCase());
    }

    static toTitleCase(input) {
        return input
        .replace(/[-_\s]+/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    }

    static toUpperCase(input) {
        return input.toUpperCase();
    }

    static toLowerCase(input) {
        return input.toLowerCase();
    }

    static convert(input, fromCase, toCase) {
        const normalize = str => {
            switch (fromCase.toLowerCase()) {
                case 'snake':
                    return str.replace(/[_]+/g, ' ');
                case 'kebab':
                    return str.replace(/[-]+/g, ' ');
                case 'camel':
                case 'pascal':
                    return str.replace(/(?<!^)[A-Z]/g, (char) => ' ' + char);
                case 'title':
                case 'upper':
                case 'lower':
                    return str.toLowerCase();
                default:
                    return str;
            }
        };

        const normalized = normalize(input)
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

        switch (toCase.toLowerCase()) {
            case 'snake':
                return normalized.toLowerCase().replace(/\s+/g, '_');
            case 'kebab':
                return normalized.toLowerCase().replace(/\s+/g, '-');
            case 'camel':
                return normalized.replace(/\s+/g, '').replace(/^./, c => c.toLowerCase());
            case 'pascal':
                return normalized.replace(/\s+/g, '');
            case 'title':
                return normalized;
            case 'upper':
                return normalized.toUpperCase();
            case 'lower':
                return normalized.toLowerCase();
            default:
                return input;
        }
    }
}