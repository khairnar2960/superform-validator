"use strict";

import { extractParam } from "./param-extractor.js";
import { parseParam } from "./param-parser.js";
import { ProcessorFunc } from "./processors/processor.js";
import { RuleName } from "./rule-name.js";
import { resolveRule } from "./rule-registry.js";
import { RuleFunction, ValidationStep } from "./rules/base-rule.js";
import { isObject } from "./rules/core-rules.js";

export type FieldRule = {
    name: string,
    type: string,
    rule: RuleFunction|ProcessorFunc|null,
    param: any;
    message?: string
};

export type ParsedSchema = Record<string, FieldRule[]>;

type SchemaRuleNames = {
    [ruleName in RuleName]?: boolean|string|number|string[]|number[];
}

export type SchemaField = SchemaRuleNames & {
    custom?: ValidationStep;
    messages?: {
        [key in RuleName]?: string;
    };
}

export type RawSchema = Record<string, SchemaField | string>;

export function parseSchema(rawSchema: RawSchema): ParsedSchema {
    const parsedSchema: ParsedSchema = {};

    for (const field in rawSchema) {
        const fieldRules: FieldRule[] = [];
        const schemaDef = rawSchema[field];

        if (typeof schemaDef === 'string') {
            const rules = schemaDef.split(/\|(?![^(]*\))/).map(rule => rule.trim());
            rules.forEach(ruleStr => {
                const { name, param: rawParam } = extractParam(ruleStr);
                const { function: validator, type, paramType, argumentType } = resolveRule(name);
                const param = parseParam(rawParam, paramType, argumentType);
                fieldRules.push({ name, type, rule: validator, param });
            });
        }

        if (typeof schemaDef === 'object') {
            const { messages = {}, ...rules } = schemaDef as SchemaField;
            for (const ruleName in rules) {
                if (ruleName === 'messages') continue;

                const param = rules[ruleName as (RuleName | 'custom')];

                // Custom rule handling
                if (isObject(param) && ((param as ValidationStep)?.callback || (param as ValidationStep)?.pattern)) {
                    fieldRules.push({
                        name: ruleName,
                        type: 'custom', rule: null, param
                    });
                } else {
                    const { function: validator, type, paramType, argumentType } = resolveRule(ruleName);
                    const parsedParam = parseParam(param === true ? null : String(param), paramType, argumentType);
                    const message = messages[ruleName as RuleName];
                    fieldRules.push({ name: ruleName, type, rule: validator, param: parsedParam, message });
                }
            }
        }

        parsedSchema[field] = fieldRules;
    }

    return parsedSchema;
}
