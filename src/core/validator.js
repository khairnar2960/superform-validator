"use strict";

import { castings } from "./default-castings.js";
import { rules as defaultRules } from "./default-rules.js";
import { Rule } from "./rule.js";

export class Validator {

    /**
     * Initiate validator on form
     * @param {?HTMLFormElement} form Form reference
     * @param {object} schema Schema definition
     * @param {function(object)} onValid Callback function on valid (optional)
     * @param {function(object)} onError Callback function on invalid (optional)
     * @param {{ errorElement: string, errorClass: string, errorId: string }} options Error message options
     * @returns {Validator}
     */
    constructor(form, schema = {}, onValid = null, onError = null, options = {}) {
        this.form = this.resolveForm(form);
        this.rawSchema = schema;
        this.onValid = onValid;
        this.onError = onError;
        this.fields = this.normalizeSchema(schema);
        this.errors = {};
        this.bind();
        this.errorElement = options.errorElement || 'div';
        this.errorClass = options.errorClass || 'validation-error';
        this.errorId = options.errorId || '@{field}-error';
    }

    generateId(fieldName) {
        return String(this.errorId).replaceAll('@{field}', fieldName);
    }

    resolveForm(input) {
        if (typeof input === 'string') {
            const node = document.querySelector(input);
            if (node && node.nodeName === 'FORM') return node;
        } else if (input?.nodeType === 1 && input.nodeName === 'FORM') {
            return input;
        }
        throw new Error('Invalid form reference');
    }

    bind() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.clearErrors();
            if (this.validate()) {
                const data = this.castData(this.getData());
                'function' === typeof this.onValid ? this.onValid(data) : this.form.submit();
            } else {
                this.scrollToFirstError();
                if ('function' === typeof this.onError) {
                    this.onError(this.errors);
                }
                this.displayErrors();
            }
        });
    }

    /**
     * Enable live validation
     * @param {string[]} events validate on events default (['blur', 'change'])
     * @returns { Validator }
     */
    enableLiveValidation(events = ['blur', 'change']) {
        for (let field in this.fields) {
            const el = this.form.querySelector(`[name="${field}"]`);
            if (el) {
                events.forEach(event => {
                    el.addEventListener(event, () => this.validateField(field));
                });
            }
        }
        return this;
    }

    normalizeSchema(schema) {
        const fields = {};
        for (let field in schema) {
            const def = schema[field];
            const out = { rules: [], messages: {}, cast: [], default: undefined };

            if (typeof def === 'string') {
                def.split(/\|(?![^(]*\))/).forEach(token => {
                    if (this.isFileRule(token)) {
                        out.rules.push(this.parseFileRules(token));
                    } else {
                        const [name, param = null] = token.split('::');
                        this.validateRuleName(name);
                        if ('custom' === name && 'string' === typeof param && this.isRegEx(param)) {
                            out.rules.push({ name, param: this.buildRegex(param) });
                        } else {
                            out.rules.push({ name, param });
                        }
                    }
                });
            } else if (Array.isArray(def)) {
                def.forEach(rule => {
                    if (typeof rule === 'string') {
                        if (this.isFileRule(rule)) {
                            out.rules.push(this.parseFileRules(rule));
                        } else {
                            const [name, param] = rule.split('::');
                            this.validateRuleName(name);
                            if ('custom' === name && 'string' === typeof param && this.isRegEx(param)) {
                                out.rules.push({ name, param: this.buildRegex(param) });
                            } else {
                                out.rules.push({ name, param });
                            }
                        }
                    } else if (typeof rule === 'object') {
                        if ('cast' in rule) {
                            const castingRules = this.parseCastingRule(rule.cast);
                            this.validateCastings(castingRules);
                            out.cast.push(...castingRules);
                        } else {
                            this.validateRuleName(rule.name);
                            out.rules.push({ name: rule.name, param: rule.value, message: rule.message });
                        }
                    }
                });
            } else if (typeof def === 'object') {
                for (let key in def) {
                    if (key === 'cast') {
                        const castingRules = this.parseCastingRule(def[key]);
                        this.validateCastings(castingRules);
                        out.cast = castingRules;
                    } else if (key === 'default') {
                        out.default = def[key];
                    } else if (key === 'custom') {
                        const rule = { name: 'custom', pattern: undefined };
                        const options = def[key];
                        if (options instanceof RegExp) {
                            rule.pattern = options;
                        } else if ('string' === typeof options && this.isRegEx(options)) {
                            rule.pattern = this.buildRegex(options);
                        } else if ('object' === typeof options) {
                            const { pattern, message } = options;
                            rule.pattern = pattern;
                            rule.message = message
                        }
                        out.rules.push(rule);
                    } else if (key === 'messages') {
                        out.messages = def[key];
                    } else {
                        let val = def[key];
                        
                        const hasParams = defaultRules.hasParams(key);
                        const isFileRule = this.isFileRule(`${key}(${val})`);

                        if (isFileRule) {
                            out.rules.push(this.parseFileRules(`${key}(${val})`));
                        } else if (typeof val === 'boolean' && val === true) {
                            out.rules.push({ name: key });
                        } else if (typeof val === 'string') {
                            const rule = { name: key };
                            if (hasParams) {
                                rule.param = val;
                            } else {
                                out.messages[key] = val;
                            }
                            out.rules.push(rule);
                        } else if (typeof val === 'object') {
                            out.rules.push({ name: key, param: val.rule });
                            out.messages[key] = val.message;
                        } else {
                            out.rules.push({ name: key, param: val });
                        }
                    }
                }
            }
            fields[field] = out;
        }
        return fields;
    }

    parseCastingRule(rule) {
        if ('function' === typeof rule) {
            return [rule];
        } else if (Array.isArray(rule)) {
            return rule;
        } else if ('string' === typeof rule) {
            return rule.split('|');
        }
        return rule;
    }

    validate() {
        this.errors = {};

        for (let field in this.fields) {
            const { rules, messages } = this.fields[field];
            const el = this.form.querySelector(`[name="${field}"]`);

            if (!el) {
                this.errors[field] = `${this.formatLabel(field)} field is missing.`;
                continue;
            }

            let value = el.type === 'checkbox' ? (el.checked ? el.value : '') : el.value;

            for (let { name, param, pattern, message } of rules) {
                if (name === 'optional' && !value) break;

                let error;
                if (name.startsWith('file')) {
                    error = this.applyFileRule(field, el?.files, name, param, message || messages[name]);
                } else {
                    error = this.applyRule(field, value, name, param || pattern, message || messages[name]);
                }

                if (error) {
                    this.errors[field] = error;
                    break;
                }
            }
        }

        return Object.keys(this.errors).length === 0;
    }

    validateField(fieldName) {
        const field = this.fields[fieldName] || {};
        const { rules, messages } = field;
        const el = this.form.querySelector(`[name="${fieldName}"]`);
        if (!el || !rules) return true;

        let value = el.type === 'checkbox' ? (el.checked ? el.value : '') : el.value;

        for (let { name, param, pattern, message } of rules) {
            if (name === 'optional' && !value) break;

            let error;
            if (name.startsWith('file')) {
                error = this.applyFileRule(fieldName, el?.files, name, param, message || messages[name]);
            } else {
                error = this.applyRule(fieldName, value, name, param || pattern, message || messages[name]);
            }

            if (error) {
                this.errors[fieldName] = error;
                this.displayErrors();
                return false;
            }
        }

        delete this.errors[fieldName];
        this.clearErrors();
        return true;
    }

    applyFileRule(field, files, ruleName, param, msg) {		
        const ruleDef = defaultRules.get(ruleName);

        if (!ruleDef) return null;

        const params = { field: this.formatLabel(field), rule: ruleName };

        if ('file::accepts' === ruleName) {
            params.types = param.join(', ');
        } else if ('file::maxSize' === ruleName) {
            params.limit = param.size;
            param = param.bytes;
        } else {
            params.limit = param;
        }

        return !ruleDef.validate(files, param) ? ruleDef.formatMessage(params, msg) : null;
    }

    applyRule(field, value, ruleName, param, msg) {

        const label = this.formatLabel(field);
        const rawValue = value;
        value = this.normalizeStr(value);
        const params = { field: label, value: rawValue, rule: ruleName };

        if ('custom' === ruleName) {
            if (
                (param instanceof RegExp && !param.test(rawValue)) ||
                ('function' === typeof param && !param(rawValue))
            ) {
                return Rule.format(params, msg || '@{field} is invalid');
            }
        } else if (['length', 'minLength', 'maxLength'].includes(ruleName)) {
            param = Number(param);
            params.length = param;
        } else if (['in', 'notIn'].includes(ruleName)) {
            param = 'string' === typeof param ? param.split(',') : (Array.isArray(param) ? param : []);
            params.listItems = param.join(', ');
        } else if (['eq', 'notEq', 'gt', 'gte', 'lt', 'lte'].includes(ruleName)) {
            params.other = param;
        } else if (
            [
                'contains', 'notContains',
                'startsWith', 'notStartsWith',
                'endsWith', 'notEndsWith'
            ].includes(ruleName)
        ) {
            param = this.normalizeStr(param);
            params.other = param;
        } else if ('match' === ruleName) {
            params.other = this.formatLabel(param);
            const target = this.form.querySelector(`[name="${param}"]`);
            value = rawValue;
            param = target || '';
        }

        const ruleDef = defaultRules.get(ruleName);

        return (ruleDef && !ruleDef.validate(value, param)) ? ruleDef.formatMessage(params, msg) : null;
    }

    getData() {
        const data = {};
        for (let field in this.fields) {
            const el = this.form.querySelector(`[name="${field}"]`);
            if (!el) continue;

            let val = el.value;

            if (el.type === 'checkbox') {
                val = (!el.value || el.value !== 'on') ? el.value : el.checked;
            } else if (el.type === 'file') {
                val = el.files;
            }

            if (!val && this.fields[field].default !== undefined) {
                val = this.fields[field].default;
            }
            data[field] = val;
        }
        return data;
    }

    castData(data) {
        for (let field in data) {
            const castList = this.fields[field].cast || [];
            for (let fn of castList) {
                if (typeof fn === 'function') {
                    data[field] = fn(data[field]);
                } else if (typeof fn === 'string') {
                    data[field] = castings.apply(fn, data[field]);
                }
            }
        }
        return data;
    }

    formatLabel(field) {
        return castings.apply('titlecase', field);
    }

    normalizeStr(val) {
        return val?.toString().trim().toLowerCase() || ''
    }

    isRegEx(input) {
        return /^\/?(.+)\/:?([gimsuy]+)?$/.test(input || '');
    }

    buildRegex(input) {
        const match = input.match(/^\/?(.+)\/:?([gimsuy]+)?$/);
        if (!match) throw new Error("Invalid regex format");
        const [, pattern, flags = ''] = match;
        return new RegExp(pattern, flags);
    }

    isFileRule(ruleDef) {
        return /^file::(\w+)\(([^)]+)\)$/.test(ruleDef);
    }

    parseFileRules(ruleDef) {
        const match = ruleDef.match(/^file::(\w+)\(([^)]+)\)$/);
        if (match) {
            const [, func, value] = match;

            if (!['maxFiles', 'maxSize', 'accepts'].includes(func)) {
                throw new Error("Invalid file rule function " + func);
            }

            const rule = {
                name: 'file::' + func,
                param: undefined,
            }

            // Handle pipe-separated lists
            if (func === 'accepts') {
                rule.param = value.split('|');
            } else if (func === 'maxSize') {
                rule.param = this.parseSize(value);
            } else {
                if (isNaN(value)) {
                    throw new Error("Invalid file count " + value);
                }
                rule.param = Number(value);
            }
            return rule;
        }
        return null
    }

    parseSize(sizeString) {
        const match = sizeString.match(/^(\d+)(kb|mb|gb|tb)$/i);

        if (!match) throw new Error("Invalid file size");

        const [_, size, unit] = match;

        const units = {
            kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4
        }

        return {
            size: size + unit,
            bytes: Number(size) * units[unit.toLowerCase()],
        };
    }

    validateRuleName(ruleName) {
        if (!['custom', 'file'].concat(defaultRules.defined()).includes(ruleName)) {
            throw new Error('Invalid rule name ' + ruleName);
        }
    }
    
    validateCasting(ruleName) {
        if ('function' !== typeof ruleName && !castings.defined().includes(ruleName)) {
            throw new Error('Invalid rule name ' + ruleName + " for casting");
        }
    }

    validateCastings(rulesArray) {
        for (const ruleName of rulesArray) {
            this.validateCasting(ruleName);
        }
    }

    displayErrors() {
        for (let field in this.errors) {
            const fieldElement = this.form.querySelector(`[name="${field}"]`);
            const isGroup = fieldElement?.parentNode.classList.contains('input-group') || false;
            const idName = this.generateId(field);
            const id = '#' + idName;
            const msg = this.errors[field];
            let errorElement = this.form.querySelector(id);
            const parentNode = fieldElement?.parentNode || this.form;

            if (!errorElement) {
                errorElement = document.createElement(this.errorElement);
                errorElement.id = idName;
                errorElement.className = this.errorClass;
                if (isGroup) {
                    parentNode.insertAdjacentElement('afterend', errorElement);
                } else {
                    parentNode.appendChild(errorElement);
                }
            }
            errorElement.innerHTML = msg;
        }
    }

    scrollToFirstError() {
        if (Object.keys(this.errors).length > 0) {
            const firstField = Object.keys(this.errors)[0];
            const el = this.form.querySelector(`[name="${firstField}"]`);
            if (el) {
                el.focus();
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    clearErrors() {
        this.form.querySelectorAll('.validation-error').forEach(e => e.remove());
    }

    reset() {
        this.form.reset();
        this.clearErrors();
        this.errors = {};
    }
}