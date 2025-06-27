"use strict";

import { Rule } from "./rule.js";

export class RuleMap {

    constructor() {
        this.rules = new Map();
    }

    /**
     * Register rule
     * @param {string} name Rule name
     * @param {((value, ...args)boolean)|RegExp} pattern Pattern or callback function
     * @param {boolean} hasParams Set rule accepts parameters
     * @param {string} messageTemplate Error message template to format
     * @returns {RuleMap}
     **/
    register(name, pattern, hasParams, messageTemplate) {
        this.rules.set(name, Rule.define(name, pattern, hasParams, messageTemplate));
        return this;
    }

    /**
     * @param {string} name Rule name
     * @returns {?Rule}
     **/
    get(name) {
        return this.rules.get(name) || null;
    }

    /**
     * @param {string} name Rule name
     * @returns {boolean}
     **/
    hasParams(name) {
        return this.get(name)?.hasParams || false;
    }

    /**
     * @param {string} name Rule name to validate against
     * @param {string} value Input value to validate 
     * @param {any[]} args Arguments for callback function
     **/
    validate(name, value, ...args) {
        const rule = this.get(name);
        return rule ? rule.validate(value, ...args) : value;
    }

    /**
     * @returns {string[]}
     **/
    defined() {
        return this.rules.keys().toArray();
    }

    static init() {
        return new RuleMap();
    }
}