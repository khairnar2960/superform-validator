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
                // Split all parts by fallback
                const parts = expression.split('||').map((part: string) => part.trim());

                let value: any;

                for (const part of parts) {
                    // If quoted, treat as literal fallback
                    if (
                        (part.startsWith('"') && part.endsWith('"')) ||
                        (part.startsWith("'") && part.endsWith("'"))
                    ) {
                        value = part.slice(1, -1);
                    } else {
                        // Try resolving path
                        value = this.resolvePath(part, placeholders);
                    }

                    // Stop at first valid value
                    if (value !== undefined && value !== null) break;
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
