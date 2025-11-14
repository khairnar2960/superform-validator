import { toCamelCase } from "../utils/case.js";
import { Processor, ProcessorFunc } from "./processors/processor.js";
import { BaseRule, RuleFunction, RuleFunctionSchema } from "./rules/base-rule.js";
import { FieldRule } from "./rules/field-rules.js";
import { IntegerRule } from "./rules/integer-rule.js";
import { FloatRule } from "./rules/float-rule.js";
import { StringRule } from "./rules/string-rule.js";
import { BooleanRule } from "./rules/boolean-rule.js";
import { DateRule } from "./rules/date-rule.js";
import { TimeRule } from "./rules/time-rule.js";
import { DateTimeRule } from "./rules/datetime-rule.js";
import { FileRule } from "./rules/file-rules.js";
import { ArrayRule } from "./rules/array-rules.js";
import { Trimmer } from "./processors/trimmer.js";
import { CaseConverter } from "./processors/case-converter.js";
import { CastingProcessor } from "./processors/casting.js";
import { MathProcessor } from "./processors/math.js";


export interface RuleMeta {
    type: string,
    functionName: string,
    function: RuleFunction|ProcessorFunc|null,
    paramType: string,
    argumentType: string,
    rule: BaseRule|Processor|null,
}

export const allRules = [
    new FieldRule(),
    new IntegerRule(),
    new FloatRule(),
    new StringRule(),
    new BooleanRule(),
    new DateRule(),
	new TimeRule(),
    new DateTimeRule(),
    new FileRule(),
    new ArrayRule(),
    new Trimmer(),
    new Trimmer(true),
    new CaseConverter(),
    new CaseConverter(true),
    new CastingProcessor(),
    new CastingProcessor(true),
    new MathProcessor(),
];

export const ruleRegistry: Record<string, RuleMeta> = {};
export const preProcessors: Record<string, RuleMeta> = {};
export const postProcessors: Record<string, RuleMeta> = {};

// Build registry dynamically
allRules.forEach((rule: BaseRule|Processor) => {
    if (rule instanceof BaseRule) {
        rule.functions.forEach((func: RuleFunction) => {
                const fullName = `${rule.type}::${func.name}`;

                if (ruleRegistry[fullName]) throw new Error("Duplicate rule entry " + fullName);

                const ruleMeta: RuleMeta = {
                    type: rule.type,
                    functionName: func.name,
                    function: func,
                    paramType: func.paramType,
                    argumentType: func.argumentType.join('|'),
                    rule,
                };

                ruleRegistry[fullName] = ruleMeta;
        
                // Register aliases
                func.aliases.forEach(alias => {
                    if (ruleRegistry[alias]) throw new Error("Duplicate rule entry " + fullName + " for alias " + alias);

                    ruleRegistry[alias] = ruleMeta;
                });
        });
    } else {
        rule.functions.forEach((func: ProcessorFunc) => {
            const { isPreprocessor } = rule;
            const fullName = toCamelCase((isPreprocessor ? 'pre ' : '') + rule.type) + `${func.name && func.name !== 'default' ? '::' + func.name : '' }`;

            if (ruleRegistry[fullName]) throw new Error("Duplicate processor entry " + fullName);

            const ruleMeta: RuleMeta = {
                type: rule.type,
                functionName: func.name || 'default',
                function: func,
                paramType: func.paramType,
                argumentType: func.argumentType,
                rule,
            };

            ruleRegistry[fullName] = ruleMeta;

            if (isPreprocessor) {
                preProcessors[fullName] = ruleMeta;
            } else {
                postProcessors[fullName] = ruleMeta;
            }

            func.aliases.forEach(alias => {

                alias = toCamelCase((isPreprocessor ? 'pre ' : '')  + alias);

                if (ruleRegistry[alias]) throw new Error("Duplicate processor entry " + fullName + " for alias " + alias);

                ruleRegistry[alias] = ruleMeta;

                if (isPreprocessor) {
                    preProcessors[alias] = ruleMeta;
                } else {
                    postProcessors[alias] = ruleMeta;
                }
            });
        })
    }
});

export function registerRule(schema: RuleFunctionSchema, type: string = 'string') {
    
    const func = new RuleFunction(schema)
    const fullName = `${type}::${func.name}`;
    
    if (ruleRegistry[fullName]) throw new Error("Duplicate rule entry " + fullName);
    
    const ruleMeta: RuleMeta = {
        type: type,
        functionName: func.name,
        function: func,
        paramType: func.paramType,
        argumentType: func.argumentType.join('|'),
        rule: null,
    };

    ruleRegistry[fullName] = ruleMeta;

    // Register aliases
    func.aliases.forEach(alias => {
        if (ruleRegistry[alias]) throw new Error("Duplicate rule entry " + fullName + " for alias " + alias);

        ruleRegistry[alias] = ruleMeta;
    });
}

export function resolveRule(name: string): RuleMeta {
    return ruleRegistry[name] || { type: 'string', function: 'unknown', paramType: 'none', argumentType: 'string' };
}