"use strict";

import { extractParam } from "./param-extractor.js";
import { parseParam } from "./param-parser.js";
import { ProcessorFunc } from "./processors/processor.js";
import { resolveRule } from "./rule-registry.js";
import { RuleFunction } from "./rules/base-rule.js";

export type FieldRule = {
    name: string,
    type: string,
    rule: RuleFunction|ProcessorFunc|null,
    param: any;
    message?: string
};

export type ParsedSchema = Record<string, FieldRule[]>;

export function parseSchema(rawSchema: any): ParsedSchema {
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
            const { messages = {}, ...rules } = schemaDef;
            for (const ruleName in rules) {
                if (ruleName === 'messages') continue;

                const param = rules[ruleName];

                // Custom rule handling
                if (typeof param === 'object' && (param.callback || param.pattern)) {
                    fieldRules.push({
                        name: ruleName,
                        type: 'custom', rule: null, param
                    });
                } else {
                    const { function: validator, type, paramType, argumentType } = resolveRule(ruleName);
                    const parsedParam = parseParam(param === true ? null : String(param), paramType, argumentType);
                    const message = messages[ruleName];
                    fieldRules.push({ name: ruleName, type, rule: validator, param: parsedParam, message });
                }
            }
        }

        parsedSchema[field] = fieldRules;
    }

    return parsedSchema;
}
