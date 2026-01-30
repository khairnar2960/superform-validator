import { ucFirst } from "../utils/case.js";
import { ErrorFormatter } from "./error-formatter.js";
import { ProcessorFunc } from "./processors/processor.js";
import { postProcessors, preProcessors } from "./rule-registry.js";
import { type Field, RuleFunction } from "./rules/base-rule.js";
import { isEmpty } from "./rules/core-rules.js";
import type { FieldRule, ParsedSchema } from "./schema-parser.js";

export interface ValidationResponse {
    valid: boolean,
    error?: string,
    processedValue?: any,
    rule?: string;
    function?: string;
}

function transformFieldValues(records: Record<string, any> = {}): Record<string, Field> {
    return Object.fromEntries(Object.entries(records).map(([name, value]) => {
        return [name, { name: ucFirst(name), value } as Field]
    }));
}

function formatError(field: string, value: any, param: any, fields: Record<string, Field>, error?: string): string {
    return ErrorFormatter.format(
        error || 'Invalid @{field} value',
        { field: ucFirst(field), value, fields, param }
    );
}

export async function validateField(value: any, fieldRules: [string, FieldRule[]], fieldValues: Record<string, any>): Promise<ValidationResponse> {

    const fields: Record<string, Field> = transformFieldValues(fieldValues);

    // 1. Apply Pre-Processors
    const [field, rules] = fieldRules;

    rules.forEach(rule => {
        if (preProcessors[rule.name]) {
            const processor = preProcessors[rule.name].function as ProcessorFunc | null;
            value = processor?.process(value, rule.param);
        }
    });

    // 2. Core Validation Phase
    const defaultRule = rules.find(rule => rule.name === 'default');
    const requireRule = rules.find(rule => rule.name.startsWith('require'));
    const isRequire = !!requireRule;
    const isOptional = rules.some(rule => rule.name === 'optional') || !isRequire;

    if (isEmpty(value) && defaultRule) {
        value = defaultRule.param;
    }

    if (isOptional && isEmpty(value)) {
        return { valid: true, processedValue: value };
    }

    if (isRequire && isEmpty(value)) {
        const rule: RuleFunction = ((requireRule as FieldRule).rule as RuleFunction);
        const result = await rule.validate(value, requireRule?.param, fields);

        if (result.valid) {
            return { valid: true, processedValue: value };
        }

        return {
            valid: false,
            rule: (requireRule as FieldRule).type,
            function: (requireRule as FieldRule).name,
            error: formatError(field, value, result.param, fields, requireRule.message ?? result.error)
        };
    }

    // 3. Type Checking (You can hook your type checker here)

    // 4. Field-Specific Rule Validation
    for (const fieldRule of rules) {
        if (fieldRule.rule instanceof RuleFunction) {
            const result = await fieldRule.rule.validate(value, fieldRule.param, fields);
            if (!result.valid) {
                return {
                    valid: false,
                    rule: fieldRule.type,
                    function: fieldRule.name,
                    error: formatError(field, value, fieldRule.param, fields, fieldRule.message ?? result.error),
                };
            }
        } else if (fieldRule.name === 'custom') {
            const message = fieldRule.param?.message;
            if (fieldRule.type === 'callback') {
                const callbackResponse = await fieldRule.param?.callback(value, null, fields);
                if (!callbackResponse) {
                    return {
                        valid: false,
                        rule: 'custom',
                        function: 'callback',
                        error: formatError(field, value, null, fields, message),
                    };
                }
            } else if (!(fieldRule.param?.pattern as RegExp).test(String(value))) {
                return {
                    valid: false,
                    rule: 'custom',
                    function: 'pattern',
                    error: formatError(field, value, fieldRule.param?.pattern, fields, message || '@{field} do not match with require pattern'),
                };
            }
        }
    }

    // 5. Apply Post-Processors
    rules.forEach(rule => {
        if (postProcessors[rule.name]) {
            const processor = postProcessors[rule.name].function as ProcessorFunc | null;
            value = processor?.process(value, rule.param);
        }
    });

    return { valid: true, processedValue: value };
}

export async function validate(schema: ParsedSchema, fieldValues: Record<string, any> = {}): Promise<Record<string, ValidationResponse>> {
    const validations: Record<string, ValidationResponse> = {};

    for (const field in schema) {
        const fieldRules: FieldRule[] = schema[field];
        const value = (fieldValues[field] as any|undefined);
        const fieldValidation: ValidationResponse = await validateField(value, [field, fieldRules], fieldValues);
        validations[field] = fieldValidation;
    }

    return validations;
}