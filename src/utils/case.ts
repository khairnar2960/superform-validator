export const toCamelCase = (value: string) => value.replace(/\s+/g, ' ')
				.replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
				.replace(/^(.)/, (_, char) => char.toLowerCase());

export const toKebabCase = (value: string) => value.replace(/(?<!^)[A-Z]/g, (char) => '-' + char).toLowerCase().replace(/\-?(\s+)\-?/g, '-');

export const toPascalCase = (value: string) => value.replace(/\s+/g, ' ')
                .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
                .replace(/^(.)/, (_, char) => char.toUpperCase());

export const toSentenceCase = (value: string) => value.trim().split(/\./).map(v => v.trim().toLowerCase().replace(/\b\w/, char => char.toUpperCase())).join('. ') + '.';

export const toSnakeCase = (value: string) => value.replace(/(?<!^)[A-Z]/g, (char) => '_' + char).toLowerCase().replace(/\_?(\s+)\_?/g, '_');

export const toTitleCase = (value: string) => value
                .replace(/[-_\s]+/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());