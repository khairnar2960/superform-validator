"use strict";

export class Rule {

    /**
     * @param {string} name Rule name
     * @param {((value, ...args)boolean)|RegExp} pattern Pattern or callback function
     * @param {boolean} hasParams Set rule accepts parameters
     * @param {string} messageTemplate Error message template to format
     **/
    constructor(name, pattern, hasParams, messageTemplate) {
        this.name = name;
        this.pattern = pattern;
        this.hasParams = hasParams;
        this.messageTemplate = messageTemplate;
    }

    /**
     * @param {string} value Input value to validate 
     * @param {any[]} args Arguments for callback function
     **/
    validate(value, ...args) {
        if ('function' === typeof this.pattern) {
            return this.pattern(value, ...args);
        } else if (this.pattern instanceof RegExp) {
            return this.pattern.test(value);
        }
        return false;
    }

    static format(params = {}, template = '') {
        template = String(template);
        for (const field in params) {
            const value = params[field];
            template = template.replaceAll(`@{${field}}`, value);
        }
        return template;
    }

    formatMessage(params = {}, customMessage = null) {
        return Rule.format(params, customMessage || this.messageTemplate || '');
    }

    /**
     * @param {string} name Rule name
     * @param {((value, ...args)boolean)|RegExp} pattern Pattern or callback function
     * @param {boolean} hasParams Set rule accepts parameters
     * @param {string} messageTemplate Error message template to format
     * @returns {Rule}
     **/
    static define(name, pattern, hasParams, messageTemplate) {
        return new Rule(name, pattern, hasParams, messageTemplate);
    }
}