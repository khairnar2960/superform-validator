"use strict";

export class ErrorFormatter {
	/**
	 * Format error message using placeholders & template
	 * @param {string} template Error template string
	 * @param {Record<string, any>} placeholders Placeholders object
	 * @returns {string}
	 */
    static format(template: string = 'Invalid value', placeholders: Record<string, any> = {}): string {
        return template.replace(/@\{([^}]+)\}/g, (_, expression) => {
            try {
                // Evaluate expression
                const [pathPart, ...fallbackParts] = expression.split('||').map((part: string) => part.trim());
                let value = this.resolvePath(pathPart, placeholders);

                // If value is undefined or null, use fallback
                if (value === undefined || value === null) {
                    value = fallbackParts.join(' || ').replace(/^['"]|['"]$/g, '');
                }

                // Transform support (e.g. trim, toUpperCase)
                if (typeof value === 'string') {
                    value = value.trim(); // Example transformation
                }

                return Array.isArray(value) ? value.join(', ') : (value ?? '');
            } catch {
                return '';
            }
        });
    }

    private static resolvePath(path: string, obj: any): any {
        const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
        return keys.reduce((acc, key) => acc?.[key], obj);
    }
}
