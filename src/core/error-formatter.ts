"use strict";

export class ErrorFormatter {
    /**
     * Format error message using placeholders, fallbacks, and modifiers
     * @param {string} template Error template string
     * @param {Record<string, any>} placeholders Placeholders object
     * @returns {string}
     */
    static format(template: string = 'Invalid value', placeholders: Record<string, any> = {}): string {
        return template.replace(/@\{([^}]+)\}/g, (_, expression) => {
            try {
                // Split all fallback parts
                const fallbackCandidates = expression.split('||').map((part: string) => part.trim());

                let value: any;

                for (const candidate of fallbackCandidates) {
                    const [path, ...modifiers] = candidate.split('|').map((part: string) => part.trim());

                    if ((path.startsWith('"') && path.endsWith('"')) || (path.startsWith("'") && path.endsWith("'"))) {
                        value = path.slice(1, -1);
                    } else {
                        value = this.resolvePath(path, placeholders);
                    }

                    if (value !== undefined && value !== null) {
                        // Apply modifiers if string
                        if (typeof value === 'string') {
                            for (const modifier of modifiers) {
                                value = this.applyModifier(value, modifier);
                            }
                        }
                        break; // stop at first valid resolved value
                    }
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

    private static applyModifier(value: string, modifier: string): string {
        switch (modifier.toLowerCase()) {
            case 'trim': return value.trim();
            case 'upper': return value.toUpperCase();
            case 'lower': return value.toLowerCase();
            case 'capitalize': return value.charAt(0).toUpperCase() + value.slice(1);
            default: return value; // Ignore unknown modifiers
        }
    }
}