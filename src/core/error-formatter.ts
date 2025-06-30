"use strict";

export class ErrorFormatter {
	
	/**
	 * Format error message using placeholders & template
	 * @param {string} template Error template string
	 * @param {Record<string, string>} placeholders Placeholders object
	 * @returns {string}
	 */
	static format(template: string = '', placeholders: Record<string, string> = {}): string {
        template = String(template);
        for (const field in placeholders) {
            const value = placeholders[field];
            template = template.replaceAll(`@{${field}}`, value);
        }
        return template;
    }
}