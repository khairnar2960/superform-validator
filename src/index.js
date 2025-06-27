export { CaseConverter } from "./core/case-converter.js";
export { registerCasting } from "./core/default-castings.js";
export { registerRule, registerRule as addCustomRule } from "./core/default-rules.js";
import { Validator } from "./core/validator.js";

/**
 * Initiate validator on form
 * @param {?HTMLFormElement} form Form reference
 * @param {object} schema Schema definition
 * @param {function(object)} onValid Callback function on valid (optional)
 * @param {function(object)} onError Callback function on invalid (optional)
 * @param {{ errorElement: string, errorClass: string, errorId: string }} options Error message options
 * @returns {Validator}
 */
export function init(form, schema, onValid, onError, options) {
	return new Validator(form, schema, onValid, onError, options);
}