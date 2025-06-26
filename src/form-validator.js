class CaseConverter {
    static toSnakeCase(input) {
        return input.replace(/(?<!^)[A-Z]/g, (char) => '_' + char).toLowerCase().replace(/\_?(\s+)\_?/g, '_');
    }

    static toKebabCase(input) {
        return input.replace(/(?<!^)[A-Z]/g, (char) => '-' + char).toLowerCase().replace(/\-?(\s+)\-?/g, '-');
    }

    static toCamelCase(input) {
        return input.replace(/\s+/g, ' ')
        .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
        .replace(/^(.)/, (_, char) => char.toLowerCase());
    }

    static toPascalCase(input) {
        return input.replace(/\s+/g, ' ')
        .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
        .replace(/^(.)/, (_, char) => char.toUpperCase());
    }

    static toTitleCase(input) {
        return input
        .replace(/[-_\s]+/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    }

    static toUpperCase(input) {
        return input.toUpperCase();
    }

    static toLowerCase(input) {
        return input.toLowerCase();
    }

    static convert(input, fromCase, toCase) {
        const normalize = str => {
            switch (fromCase.toLowerCase()) {
                case 'snake':
                    return str.replace(/[_]+/g, ' ');
                case 'kebab':
                    return str.replace(/[-]+/g, ' ');
                case 'camel':
                case 'pascal':
                    return str.replace(/(?<!^)[A-Z]/g, (char) => ' ' + char);
                case 'title':
                case 'upper':
                case 'lower':
                    return str.toLowerCase();
                default:
                    return str;
            }
        };

        const normalized = normalize(input)
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

        switch (toCase.toLowerCase()) {
            case 'snake':
                return normalized.toLowerCase().replace(/\s+/g, '_');
            case 'kebab':
                return normalized.toLowerCase().replace(/\s+/g, '-');
            case 'camel':
                return normalized.replace(/\s+/g, '').replace(/^./, c => c.toLowerCase());
            case 'pascal':
                return normalized.replace(/\s+/g, '');
            case 'title':
                return normalized;
            case 'upper':
                return normalized.toUpperCase();
            case 'lower':
                return normalized.toLowerCase();
            default:
                return input;
        }
    }
}

class Rule {

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

class RuleSet {
    constructor() {
        this.rules = new Map();
    }

    /**
     * @param {string} name Rule name
     * @param {((value, ...args)boolean)|RegExp} pattern Pattern or callback function
     * @param {boolean} hasParams Set rule accepts parameters
     * @param {string} messageTemplate Error message template to format
     * @returns {RuleSet}
     **/
    add(name, pattern, hasParams, messageTemplate) {
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
}

class Cast {
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }

    apply(value) {
        try {
            return this.callback(value);
        } catch {
            return value;
        }
    }

    static define(name, callback) {
        return new Cast(name, callback);
    }
}

class CastSet {
    constructor() {
        this.rules = new Map();
    }

    add(name, callback) {
        this.rules.set(name, Cast.define(name, callback));
        return this;
    }

    /**
     * @param {string} name Casting rule name
     * @returns {?Cast}
     **/
    get(name) {
        return this.rules.get(name) || null;
    }

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
}

class FormValidator {
    constructor(form, schema = {}, onValid = null, onError = null, options = {}) {
        this.ruleSet = this.loadRuleset();
        this.casting = this.loadCasting();
        this.form = this.resolveForm(form);
        this.rawSchema = schema;
        this.onValid = onValid;
        this.onError = onError;
        this.fields = this.normalizeSchema(schema);
        this.errors = {};
        this.bind();
        this.errorElement = options.errorElement || 'div';
        this.errorClass = options.errorClass || 'validation-error';
    }

    loadRuleset() {
        const ruleSet = new RuleSet();

        ruleSet.add('require', (value) => {
            return value.length > 0;
        }, false, '@{field} is required');

        ruleSet.add('minLength', (value, length) => {
            return length <= value.length;
        }, true, 'Minimum length is @{length}');

        ruleSet.add('maxLength', (value, length) => {
            return length >= value.length;
        }, true, 'Maximum length is @{length}');

        ruleSet.add('length', (value, length) => {
            return length === value.length;
        }, true, 'Must be exactly @{length} characters');

        ruleSet.add('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, false, 'Invalid email address');
        
        ruleSet.add('pincode', /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, false, 'Invalid PIN Code');
        
        ruleSet.add('pan', /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, false, 'Invalid PAN');

        ruleSet.add('ifsc', /^[A-Z]{4}0[A-Z0-9]{6}$/, false, 'Invalid IFSC');

        ruleSet.add('alpha', /^[a-zA-Z]+$/, false, 'Only alphabets allowed');

        ruleSet.add('alphaspace', /^[a-zA-Z\s]+$/, false, 'Only alphabets & spaces allowed');

        ruleSet.add('alphanum', /^[0-9a-zA-Z]+$/, false, 'Only alphabets & numbers allowed');

        ruleSet.add('alphanumspace', /^[0-9a-zA-Z\s]+$/, false, 'Only alphabets, number & spaces allowed');

        ruleSet.add('slug', /^[0-9a-zA-Z-]+$/, false, 'Invalid slug');

        ruleSet.add('decimal', /^(\d+)\.?(\d+)?$/, false, 'Invalid @{field}');

        ruleSet.add('numeric', (val) => {
            return !isNaN(val);
        }, false, '@{field} must be numeric');

        ruleSet.add('mobile', /^[6-9]{1}[0-9]{9}$/, false, '@{field} must be a valid mobile number');

        ruleSet.add('integer', /^\d+$/, false, '@{field} must be integer');

        ruleSet.add('date', /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, false, '@{field} must be valid date');

        ruleSet.add('match', (value, other) => {
            return other && other?.value === value;
        }, true, '@{field} do not match with @{other}');

        ruleSet.add('in', (value, listItems) => {
            return listItems.includes(value);
        }, true, '@{field} must be between (@{listItems})');

        ruleSet.add('notIn', (value, listItems) => {
            return !listItems.includes(value);
        }, true, '@{field} must not be between (@{listItems})');

        ruleSet.add('eq', (value, other) => {
            return other === value;
        }, true, '@{field} must be exactly @{other}');

        ruleSet.add('notEq', (value, other) => {
            return other !== value;
        }, true, '@{field} must not be @{other}');

        ruleSet.add('gt', (value, other) => {
            return other < value;
        }, true, '@{field} must be greater than @{other}');

        ruleSet.add('gte', (value, other) => {
            return other <= value;
        }, true, '@{field} must be greater than or equal to @{other}');

        ruleSet.add('lt', (value, other) => {
            return other > value;
        }, true, '@{field} must be less than @{other}');
        
        ruleSet.add('lte', (value, other) => {
            return other >= value;
        }, true, '@{field} must be less than or equal to @{other}');

        ruleSet.add('contains', (value, other) => {
            return value.includes(other);
        }, true, '@{field} must contain @{other}');

        ruleSet.add('notContains', (value, other) => {
            return !value.includes(other);
        }, true, '@{field} must not contain @{other}');

        ruleSet.add('startsWith', (value, other) => {
            return value.startsWith(other);
        }, true, '@{field} must start with @{other}');

        ruleSet.add('notStartsWith', (value, other) => {
            return !value.startsWith(other);
        }, true, '@{field} must not start with @{other}');

        ruleSet.add('endsWith', (value, other) => {
            return value.endsWith(other);
        }, true, '@{field} must end with @{other}');

        ruleSet.add('notEndsWith', (value, other) => {
            return !value.endsWith(other);
        }, true, '@{field} must not end with @{other}');

        ruleSet.add('file::maxFiles', (files, limit) => {
            return Array.from(files || []).length <= limit;
        }, true, 'Maximum @{limit} files allowed');

        ruleSet.add('file::maxSize', (files, limit) => {
            return Array.from(files || []).every(file => file.size <= limit);
        }, true, 'File size exceeds @{limit}');

        ruleSet.add('file::accepts', (files, types) => {
            const allowed = Array.isArray(types) ? types : String(types).split('|');
            return Array.from(files || []).every(file => {
                const ext = file.name.split('.').pop().toLowerCase();
                return allowed.includes(ext) || allowed.includes(file.type);
            });
        }, true, 'Invalid file type. Only (@{types}) allowed');


        return ruleSet;
    }

    /**
     * @param {string} name Rule name
     * @param {((value, ...args)boolean)|RegExp} callback Pattern or callback function
     * @param {string} messageTemplate Error message template to format
     * @returns {void}
     **/
    addCustomRule(name, callback, messageTemplate) {
        this.ruleSet.add(name, callback, true, messageTemplate);
    }

    loadCasting() {
        const casting = new CastSet();

        casting.add('trim', (value) => {
            return typeof value === 'string' ? value.trim() : value;
        });

        casting.add('integer', (value) => parseInt(value, 10));

        casting.add('float', (value) => parseFloat(value));

        casting.add('boolean', (value) => {
            value = (value || '').toLowerCase();
            return ['0', 'false'].includes(value) ? false : Boolean(value);
        });

        casting.add('lowercase', (value) => {
            return CaseConverter.toLowerCase(value);
        });

        casting.add('uppercase', (value) => {
            return CaseConverter.toUpperCase(value);
        });

        casting.add('snakecase', (value) => {
            return CaseConverter.toSnakeCase(value);
        });

        casting.add('kebabcase', (value) => {
            return CaseConverter.toKebabCase(value);
        });

        casting.add('camelcase', (value) => {
            return CaseConverter.toCamelCase(value);
        });

        casting.add('pascalcase', (value) => {
            return CaseConverter.toPascalCase(value);
        });

        casting.add('titlecase', (value) => {
            return CaseConverter.toTitleCase(value);
        });

        return casting;
    }

    static init(form, schema, onValid, onError, options) {
        return new FormValidator(form, schema, onValid, onError, options);
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

    enableLiveValidation(events = ['blur', 'change']) {
        for (let field in this.fields) {
            const el = this.form.querySelector(`[name="${field}"]`);
            if (el) {
                events.forEach(event => {
                    el.addEventListener(event, () => this.validateField(field));
                });
            }
        }
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
                        
                        const hasParams = this.ruleSet.hasParams(key);
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
        const ruleDef = this.ruleSet.get(ruleName);

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

        const ruleDef = this.ruleSet.get(ruleName);

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
                    data[field] = this.casting.apply(fn, data[field]);
                }
            }
        }
        return data;
    }

    formatLabel(field) {
        return this.casting.apply('titlecase', field);
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
        if (!['custom', 'file'].concat(this.ruleSet.defined()).includes(ruleName)) {
            throw new Error('Invalid rule name ' + ruleName);
        }
    }
    
    validateCasting(ruleName) {
        if ('function' !== typeof ruleName && !this.casting.defined().includes(ruleName)) {
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
            const idName = `${field}-error`;
            const id = '#' + idName;
            const msg = this.errors[field];
            let errorElement = this.form.querySelector(id);

            if (!errorElement) {
                errorElement = document.createElement(this.errorElement);
                errorElement.id = idName;
                errorElement.className = this.errorClass;
                if (isGroup) {
                    fieldElement.parentNode.insertAdjacentElement('afterend', errorElement);
                } else {
                    fieldElement.parentNode.appendChild(errorElement);
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