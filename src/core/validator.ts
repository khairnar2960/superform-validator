// 📦 Core Independent Validator

export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
    processedData: Record<string, any>;
}

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

    validate(formData: Record<string, any>): ValidationResult {
        const errors: Record<string, string> = {};
        const processedData: Record<string, any> = {};
        let valid = true;

        for (const field in this.parsedSchema) {
            const fieldRules = this.parsedSchema[field];
            const fieldValue = formData[field];

            const result = validateField(fieldValue, fieldRules);
            if (!result.valid) {
                valid = false;
                errors[field] = result.error || 'Invalid value';
            } else {
                processedData[field] = result.processedValue;
            }
        }

        return { valid, errors, processedData };
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
                const field = (e.target as HTMLInputElement).name;
                const formData = { [field]: (e.target as HTMLInputElement).value };
                const result = validator.validate(formData);
                if (!result.valid && result.errors[field]) {
                    // Show error (You can customize this part)
                    const errorElement = document.querySelector(`#${field}-error`);
                    if (errorElement) errorElement.textContent = result.errors[field];
                } else {
                    const errorElement = document.querySelector(`#${field}-error`);
                    if (errorElement) errorElement.textContent = '';
                }
            });
        });
    }
});

// ==========================
// 📄 Express Plugin Example
// ==========================

import { Request, Response, NextFunction } from 'express';
import { parseSchema } from './schema-parser.js';
import { validateField } from './validator-engine.js';

export const ExpressPlugin = (schema: any) => {
    const validator = new Validator(schema);

    return (req: Request, res: Response, next: NextFunction) => {
        const result = validator.validate(req.body);
        if (!result.valid) {
            return res.status(400).json({ errors: result.errors });
        }
        req.body = result.processedData;
        next();
    };
};

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
