"use strict";

import { extractParam } from "./param-extractor.js";
import { parseParam } from "./param-parser.js";
import { Processor } from "./processor.js";
import { resolveRule } from "./rule-registry.js";
import { BaseRule } from "./rules/base-rule.js";

export type FieldRule = {
    name: string,
    func: string | null,
    type: string,
    rule: BaseRule|Processor|null,
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
                const { name, func, param: rawParam } = extractParam(ruleStr);
                const { rule, type, paramType, argumentType } = resolveRule(name);
                const param = parseParam(rawParam, paramType, argumentType);
                fieldRules.push({ name, func, type, rule, param });
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
                        name: ruleName, func: (param.callback ? 'callback' : 'pattern'),
                        type: 'custom', rule: null, param
                    });
                } else {
                    const [_,func = null] = ruleName.split('::').map(n => n.trim());
                    const { rule, type, paramType, argumentType } = resolveRule(ruleName);
                    const parsedParam = parseParam(param === true ? null : String(param), paramType, argumentType);
                    const message = messages[ruleName];
                    fieldRules.push({ name: ruleName, func, type, rule, param: parsedParam, message });
                }
            }
        }

        parsedSchema[field] = fieldRules;
    }

    return parsedSchema;
}
