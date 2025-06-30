import { Processor } from "./processor.js";
import { postProcessors, preProcessors } from "./rule-registry.js";
import { BaseRule } from "./rules/base-rule.js";
import { isEmpty } from "./rules/core-rules.js";
import { FieldRule } from "./schema-parser.js";

export function validateField(value: any, fieldRules: FieldRule[]): { valid: boolean, error?: string, processedValue?: any } {
    // 1. Apply Pre-Processors
    fieldRules.forEach(rule => {
        if (preProcessors[rule.name]) {
            const processor = preProcessors[rule.name].rule as Processor;
            value = processor.process(rule.func || rule.name, value);
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
        if (fieldRule.rule instanceof BaseRule) {
            const result = fieldRule.rule.validate(fieldRule.func || fieldRule.name, value, fieldRule.param);
            if (!result.valid) {
                return { valid: false, error: result.error };
            }
        }
    }

    // 5. Apply Post-Processors
    fieldRules.forEach(rule => {
        if (postProcessors[rule.name]) {
            const processor = postProcessors[rule.name].rule as Processor;
            value = processor.process(rule.func || rule.name, value);
        }
    });

    return { valid: true, processedValue: value };
}
