"use strict";

export class Casting {
	/**
	 * Define casting rule
	 * @param {string} name Casting rule name
	 * @param {function(string):any} callback Callback function to cast value
	 */
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }

	/**
	 * Apply casting rule over raw field value
	 * @param {string} value Raw field value
	 * @returns {any}
	 */
    apply(value) {
        try {
            return this.callback(value);
        } catch {
            return value;
        }
    }

	/**
	 * Define casting rule
	 * @param {string} name Casting rule name
	 * @param {function(string):any} callback Callback function to cast value
	 */
    static define(name, callback) {
        return new Casting(name, callback);
    }
}