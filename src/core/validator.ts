import { Request, Response, NextFunction } from 'express';
import { parseSchema } from './schema-parser.js';
import { validate, ValidationResponse } from './validator-engine.js';

export type Plugin = {
    name: string;
    attach: (validator: Validator) => void;
};

export class Validator {
    private schema: any;
    private parsedSchema: any;
    private plugins: Plugin[] = [];

    constructor(schema: any) {
        this.schema = schema;
        this.parsedSchema = parseSchema(schema);
    }

    use(plugin: Plugin) {
        plugin.attach(this);
        this.plugins.push(plugin);
    }

    validate(formData: Record<string, any>): Record<string, ValidationResponse> {
        return validate(this.parsedSchema, formData)
    }
}

// ==========================
// 📄 HTML Plugin Example
// ==========================

export const HTMLPlugin = (): Plugin => ({
    name: 'HTML',
    attach: (validator: Validator) => {
        document.querySelectorAll('[data-validate]').forEach(element => {
            element.addEventListener('blur', (e) => {
                // const field = (e.target as HTMLInputElement).name;
                // const formData = { [field]: (e.target as HTMLInputElement).value };
                // const result = validator.validate(formData);
                // if (!result.valid && result.errors[field]) {
                //     // Show error (You can customize this part)
                //     const errorElement = document.querySelector(`#${field}-error`);
                //     if (errorElement) errorElement.textContent = result.errors[field];
                // } else {
                //     const errorElement = document.querySelector(`#${field}-error`);
                //     if (errorElement) errorElement.textContent = '';
                // }
            });
        });
    }
});

// ==========================
// 📄 React Plugin Skeleton (Concept)
// ==========================

export const ReactPlugin = (): Plugin => ({
    name: 'React',
    attach: (validator: Validator) => {
        // React should use a hook like useValidator
        // React integration can expose methods: validateField, validateForm, handleChange, handleBlur
        // Example: return { validateField, validateForm } in hook
        // The actual integration should be done in a React-specific module using this validator
    }
});
