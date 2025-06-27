"use strict";

import { RuleMap } from "./rulemap";

const rules = RuleMap.init();

rules.register('require', (value) => {
	return value.length > 0;
}, false, '@{field} is required');

rules.register('minLength', (value, length) => {
	return length <= value.length;
}, true, 'Minimum length is @{length}');

rules.register('maxLength', (value, length) => {
	return length >= value.length;
}, true, 'Maximum length is @{length}');

rules.register('length', (value, length) => {
	return length === value.length;
}, true, 'Must be exactly @{length} characters');

rules.register('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, false, 'Invalid email address');

rules.register('pincode', /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, false, 'Invalid PIN Code');

rules.register('pan', /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, false, 'Invalid PAN');

rules.register('ifsc', /^[A-Z]{4}0[A-Z0-9]{6}$/, false, 'Invalid IFSC');

rules.register('alpha', /^[a-zA-Z]+$/, false, 'Only alphabets allowed');

rules.register('alphaspace', /^[a-zA-Z\s]+$/, false, 'Only alphabets & spaces allowed');

rules.register('alphanum', /^[0-9a-zA-Z]+$/, false, 'Only alphabets & numbers allowed');

rules.register('alphanumspace', /^[0-9a-zA-Z\s]+$/, false, 'Only alphabets, number & spaces allowed');

rules.register('slug', /^[0-9a-zA-Z-]+$/, false, 'Invalid slug');

rules.register('decimal', /^(\d+)\.?(\d+)?$/, false, 'Invalid @{field}');

rules.register('numeric', (val) => {
	return !isNaN(val);
}, false, '@{field} must be numeric');

rules.register('mobile', /^[6-9]{1}[0-9]{9}$/, false, '@{field} must be a valid mobile number');

rules.register('integer', /^\d+$/, false, '@{field} must be integer');

rules.register('date', /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, false, '@{field} must be valid date');

rules.register('time', /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, false, '@{field} must be valid time');

rules.register('url', /\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i, false, '@{field} must be valid url');

rules.register('match', (value, other) => {
	return other && other?.value === value;
}, true, '@{field} do not match with @{other}');

rules.register('in', (value, listItems) => {
	return listItems.includes(value);
}, true, '@{field} must be between (@{listItems})');

rules.register('notIn', (value, listItems) => {
	return !listItems.includes(value);
}, true, '@{field} must not be between (@{listItems})');

rules.register('eq', (value, other) => {
	return other === value;
}, true, '@{field} must be exactly @{other}');

rules.register('notEq', (value, other) => {
	return other !== value;
}, true, '@{field} must not be @{other}');

rules.register('gt', (value, other) => {
	return other < value;
}, true, '@{field} must be greater than @{other}');

rules.register('gte', (value, other) => {
	return other <= value;
}, true, '@{field} must be greater than or equal to @{other}');

rules.register('lt', (value, other) => {
	return other > value;
}, true, '@{field} must be less than @{other}');

rules.register('lte', (value, other) => {
	return other >= value;
}, true, '@{field} must be less than or equal to @{other}');

rules.register('contains', (value, other) => {
	return value.includes(other);
}, true, '@{field} must contain @{other}');

rules.register('notContains', (value, other) => {
	return !value.includes(other);
}, true, '@{field} must not contain @{other}');

rules.register('startsWith', (value, other) => {
	return value.startsWith(other);
}, true, '@{field} must start with @{other}');

rules.register('notStartsWith', (value, other) => {
	return !value.startsWith(other);
}, true, '@{field} must not start with @{other}');

rules.register('endsWith', (value, other) => {
	return value.endsWith(other);
}, true, '@{field} must end with @{other}');

rules.register('notEndsWith', (value, other) => {
	return !value.endsWith(other);
}, true, '@{field} must not end with @{other}');

rules.register('file::maxFiles', (files, limit) => {
	return Array.from(files || []).length <= limit;
}, true, 'Maximum @{limit} files allowed');

rules.register('file::maxSize', (files, limit) => {
	return Array.from(files || []).every(file => file.size <= limit);
}, true, 'File size exceeds @{limit}');

rules.register('file::accepts', (files, types) => {
	const allowed = Array.isArray(types) ? types : String(types).split('|');
	return Array.from(files || []).every(file => {
		const ext = file.name.split('.').pop().toLowerCase();
		return allowed.includes(ext) || allowed.includes(file.type);
	});
}, true, 'Invalid file type. Only (@{types}) allowed');

/**
 * Register custom rule
 * @param {string} name Rule name
 * @param {((value, ...args)boolean)|RegExp} callback Pattern or callback function
 * @param {string} messageTemplate Error message template to format
 * @returns {void}
 **/
export function registerRule(name, callback, messageTemplate) {
	rules.register(name, callback, true, messageTemplate);
}

export { rules }