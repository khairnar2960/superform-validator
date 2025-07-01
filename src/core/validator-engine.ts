import { ucFirst } from "../utils/case.js";
import { ErrorFormatter } from "./error-formatter.js";
import { ProcessorFunc } from "./processors/processor.js";
import { postProcessors, preProcessors } from "./rule-registry.js";
import { Field, RuleFunction } from "./rules/base-rule.js";
import { isEmpty } from "./rules/core-rules.js";
import { FieldRule, ParsedSchema } from "./schema-parser.js";

export interface ValidationResponse {
    valid: boolean,
    error?: string,
    processedValue?: any,
    param?: any
}

export function validateField(value: any, fieldRules: FieldRule[], fields: Record<string, Field>): ValidationResponse {
    // 1. Apply Pre-Processors
    fieldRules.forEach(rule => {
        if (preProcessors[rule.name]) {
            const processor = preProcessors[rule.name].function as ProcessorFunc | null;
            value = processor?.process(value);
        }
    });

    // 2. Core Validation Phase
    const isOptional = fieldRules.some(rule => rule.name === 'optional');
    const isRequire = fieldRules.some(rule => rule.name === 'require');

    if (isOptional && isEmpty(value)) {
        return { valid: true, processedValue: value };
    }

    if (isRequire && isEmpty(value)) {
        return { valid: false, error: '@{field} is required' };
    }

    // 3. Type Checking (You can hook your type checker here)

    // 4. Field-Specific Rule Validation
    for (const fieldRule of fieldRules) {
        if (fieldRule.rule instanceof RuleFunction) {
            const result = fieldRule.rule.validate(value, fieldRule.param, fields);
            if (!result.valid) {
                return { valid: false, error: result.error, param: fieldRule.param };
            }
        } else if (!(fieldRule.rule instanceof ProcessorFunc)) {
            console.log(fieldRule);
        }
    }

    // 5. Apply Post-Processors
    fieldRules.forEach(rule => {
        if (postProcessors[rule.name]) {
            const processor = postProcessors[rule.name].function as ProcessorFunc | null;
            value = processor?.process(value);
        }
    });

    return { valid: true, processedValue: value };
}


export function validate(schema: ParsedSchema, fieldValues: Record<string, any> = {}): Record<string, ValidationResponse> {
    const validations: Record<string, ValidationResponse> = {};

    const fieldValuesDate: Record<string, Field> = Object.fromEntries(Object.entries(fieldValues).map(([name, value]) => {
        return [name, { name: ucFirst(name), value }]
    }));

    for (const field in schema) {
        const fieldRules: FieldRule[] = schema[field];

        const value = (fieldValues[field] as any|undefined);
        
        const { valid, error = undefined, processedValue = undefined, param = undefined } = validateField(value, fieldRules, fieldValuesDate);
        
        const fieldValidation: ValidationResponse = { valid }; 

        if (!valid) {
            fieldValidation.error = ErrorFormatter.format(
                error || 'Invalid @{field} value',
                {
                    field: ucFirst(field),
                    value,
                    fields: fieldValuesDate,
                    param
                }
            );
        } else {
            fieldValidation.processedValue = processedValue;
        }

        validations[field] = fieldValidation;
    }

    return validations;
}