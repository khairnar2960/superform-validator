import { registerRule } from "./rule-registry.js";
import { RuleFunctionSchema } from "./rules/base-rule.js";
import { ParsedSchema, parseSchema, RawSchema } from "./schema-parser.js";
import { validateField, ValidationResponse } from "./validator-engine.js";

type ValidCallback = (valid: Record<string, any>) => void;
type InvalidCallback = (invalid: Record<string, any>) => void;
type AllowedEvents = "blur" | "change" | "focus" | "input";
type InputElement = HTMLSelectElement|HTMLInputElement|HTMLTextAreaElement|null;

interface ValidatorOptions {
    errorElement?: keyof HTMLElementTagNameMap,
    errorClass?: string,
    errorId?: string
}
interface TransformedFileList {
    file: File,
    name: string,
    size: number,
    type: string,
    extension: string,
}

const transformFiles = (files: FileList): TransformedFileList[] => {
    return Array.from(files).map((file: File) => {
        const { name, size, type } = file;
        const ext = name.split('.')
        return {
            file, name, size, type, extension: (ext.length > 1 ? ext.at(-1) : '') as string
        }
    })
}

class Validator {
    private form: HTMLFormElement;
    private rawSchema: RawSchema;
    private fields: ParsedSchema;
    private onValid: ValidCallback|null;
    private onError: InvalidCallback|null;
    private errors: Record<string, string>;

    private errorElement: keyof HTMLElementTagNameMap = 'div';
    private errorClass: string = 'validation-error';
    private errorId: string = '@{field}-error';

	constructor(
        form: HTMLFormElement|string,
        schema: RawSchema = {},
        onValid: ValidCallback|null = null,
        onError: InvalidCallback|null = null,
        options: ValidatorOptions = {}
    ) {
		this.form = this.resolveForm(form);
        this.rawSchema = schema;
        this.fields = parseSchema(schema);
        this.onValid = onValid;
        this.onError = onError;
        this.errors = {};
        this.bind();
        this.parseOptions(options);
	}

    parseOptions(options: ValidatorOptions): void {
        if (options.errorElement) {
            this.errorElement = options.errorElement;
        }

        if (options.errorClass) {
            this.errorClass = options.errorClass;
        }

        if (options.errorId) {
            if (!/^([a-z-]+)?(@\{field\})([a-z-]+)?$/.test(options.errorId)) throw new Error('Invalid template for error id');

            this.errorId = options.errorId;
        }
    }

    generateId(fieldName: string) {
        return String(this.errorId).replaceAll('@{field}', fieldName);
    }

    resolveForm(input: HTMLFormElement|string): HTMLFormElement {
        if ('string' === typeof input) {
            const node = document.querySelector(input);
            if (node && node.nodeName === 'FORM') return node as HTMLFormElement;
        } else if (input?.nodeType === 1 && input.nodeName === 'FORM') {
            return input;
        }
        throw new Error('Invalid form reference');
    }

    bind() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            const { valid, validated = {} } = this.validate();
            if (valid) {
                'function' === typeof this.onValid ? this.onValid(validated) : this.form.submit();
            } else {
                this.scrollToFirstError();
                if ('function' === typeof this.onError) {
                    this.onError(this.errors);
                }
                this.renderErrors();
            }
        });
    }

    enableLiveValidation(events: AllowedEvents[] = ['blur', 'change']): this {
        for (let field in this.fields) {
            const el = this.form.querySelector(`[name="${field}"]`);
            if (el) {
                events.forEach(event => {
                    el.addEventListener(event, () => {
                        this.validateField(field, this.collectFieldValues());
                        this.renderErrors();
                    });
                });
            }
        }
        return this;
    }

    collectFieldValues(): Record<string, any> {
        return Object.fromEntries(Object.keys(this.fields).map(field => {
            const el = this.form.querySelector(`[name="${field}"]`) as InputElement;
            return [field, el?.value];
        }));
    }

    validateField(fieldName: string, fieldValues: Record<string, any> = {}): ValidationResponse {
        const el = this.form.querySelector(`[name="${fieldName}"]`) as InputElement;
        const rules = this.fields[fieldName] || [];
        if (!el || !rules.length) return { valid: true };

        let value = el instanceof HTMLInputElement ? (
            el.type === 'checkbox' ? (el.checked ? el.value : '') : (
                el.type === 'file' ? transformFiles(el.files as FileList) : el.value
            )) : el.value;

        const result: ValidationResponse = validateField(value, [fieldName, rules], fieldValues);

        if (!result.valid) {
            this.errors[fieldName] = result?.error as string;
        } else {
            delete this.errors[fieldName];
        }
        return result;
    }

    validate(): { valid: boolean, validated: Record<string, any> } {
        const validated: Record<string, any> = {};
        this.errors = {};
        const fieldValues = this.collectFieldValues();
        for (const fieldName in this.fields) {
            const { valid, processedValue = '' } = this.validateField(fieldName, fieldValues);
            if (valid) {
                validated[fieldName] = processedValue;
            }
        }
        const isValid = Object.keys(this.errors).length === 0;

        return { valid: isValid, validated };
    }

    scrollToFirstError() {
        if (Object.keys(this.errors).length > 0) {
            const firstField = Object.keys(this.errors)[0];
            const el = this.form.querySelector(`[name="${firstField}"]`) as InputElement;
            if (el) {
                el.focus();
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    renderErrors() {
        const errorClass = this.errorClass;
        const errorElement = this.errorElement;
        for (const field in this.fields) {
            const fieldElement = this.form.querySelector(`[name="${field}"]`) as InputElement;
            let parentNode = fieldElement?.parentNode as Element | null;
            const isGroup = parentNode ? parentNode.classList.contains('input-group') : false;
            parentNode = parentNode || this.form;

            const id = this.generateId(field);
            const errorId = '#' + id;
            const errorMessage = this.errors[field] || null;
            let element = this.form.querySelector(errorId);

            if (!errorMessage) {
                element ? element.classList.contains(errorClass) ? element.remove() : (element.innerHTML = '') : null;
            } else {
                if (!element) {
                    element = document.createElement(errorElement);
                    element.id = id;
                    element.className = errorClass;

                    if (isGroup) {
                        parentNode.insertAdjacentElement('afterend', element);
                    } else {
                        parentNode.appendChild(element);
                    }
                }
                element.innerHTML = errorMessage;
            }
        }
    }

    reset() {
        this.form.reset();
        this.errors = {};
        this.renderErrors();
    }

    registerRule(schema: RuleFunctionSchema, type?: string) {
        registerRule(schema, type);
    }
}

export const init = (
    form: HTMLFormElement|string,
    schema: RawSchema = {},
    onValid: ValidCallback|null = null,
    onError: InvalidCallback|null = null,
    options: ValidatorOptions = {}
)  => {
    return new Validator(form, schema, onValid, onError, options);
}