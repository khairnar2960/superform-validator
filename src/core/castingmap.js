"use strict";

import { Casting } from "./casting.js";

export class CastingMap {

    constructor() {
        this.rules = new Map();
        this.alias = new Map();
    }

	/**
	 * Register casting rule
	 * @param {string} name Casting rule name
	 * @param {function(string):any} callback Callback function to cast value
     * @param {array|string|null} alias Alias names
	 * @returns {CastingMap}
	 */
    register(name, callback, alias = null) {
        const rule = Casting.define(name, callback);
        this.rules.set(name, rule);
        this.registerAlias(name, rule, alias);
        return this;
    }

    /**
	 * Register casting rule
	 * @param {string} name Casting rule name
     * @param {Casting} rule Casting rule
     * @param {array|string|null} alias Alias names
	 * @returns {void}
	 */
    registerAlias(name, rule, alias) {
        if (!alias) return;

        alias = Array.isArray(alias) ? alias : ('string' === typeof alias ? [alias] : []);

        alias.forEach(_alias => {
            this.alias.set(_alias, name);
            this.rules.set(_alias, rule);
        });
    }

    /**
     * @param {string} name Casting rule name
     * @returns {?Casting}
     **/
    get(name) {
        return this.rules.get(name) || null;
    }

	/**
	 * Apply casting rule over raw field value
	 * @param {string} name Casting rule name
	 * @param {string} value Raw field value
	 * @returns {any}
	 */
    apply(name, value) {
        const rule = this.get(name);
        return rule ? rule.apply(value) : value;
    }

    /**
     * @returns {string[]}
     **/
    defined() {
        return this.rules.keys().toArray();
    }

	/**
	 * Create new casting map
	 * @returns {CastingMap}
	 */
	static init() {
		return new CastingMap();
	}
}