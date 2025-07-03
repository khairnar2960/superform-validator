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
                // Support modifiers, fallback chain
                const [pathWithModifiers, ...fallbackParts] = expression.split('||').map((part: string) => part.trim());
                const pathModifierMatch = pathWithModifiers.split('|').map((part: string) => part.trim());
                const pathPart = pathModifierMatch[0];
                const modifiers = pathModifierMatch.slice(1);

                let value: any;

                // Try each fallback in order
                const fallbackCandidates = [pathPart, ...fallbackParts];

                for (const part of fallbackCandidates) {
                    if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
                        value = part.slice(1, -1);
                    } else {
                        value = this.resolvePath(part, placeholders);
                    }

                    if (value !== undefined && value !== null) break;
                }

                // Apply modifiers if value is string
                if (typeof value === 'string') {
                    for (const modifier of modifiers) {
                        value = this.applyModifier(value, modifier);
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