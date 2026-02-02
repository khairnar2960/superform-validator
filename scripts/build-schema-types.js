import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { writeFileSync } from "fs";
import { ruleRegistry } from "../dist/core/rule-registry.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entries = Object.entries(ruleRegistry)

const args = {
  any: 'any',
  fieldName: 'string',
  number: 'number',
  integer: 'number',
  float: 'number',
  string: 'string',
  date: 'string',
  time: 'string',
  datetime: 'string'
}

let types = '';

for (const [name, rule] of entries) {
    const { argumentType, paramType } = rule.function;
    const argType = !Array.isArray(argumentType) ? [argumentType] : argumentType;
    let type;
    if (paramType === 'none') {
        type = 'boolean';
    } else if (paramType === 'single') {
        type = argType.map(t => args[t]).join(' | ');
    } else if (paramType === 'list') {
        type = argType.map(t => args[t] + '[]').join(' | ');
    } else if (paramType === 'range') {
        type = argType.map(t => `[${args[t]}, ${args[t]}]`).join(' | ');
    } else if (paramType === 'fieldEquals') {
        type = argType.map(() => '`${string}=${string}`').join(' | ');
    } else {
        type = argType.map(t => args[t]).join(' | ');
    }
    types += (name.includes('::') ? `'${name}'` : name) + '?: ' + type + ';\n\t';
}

const ruleNames = 'import type { ValidationStep } from "./rules/base-rule.js";\n\nexport interface SchemaRuleNames {\n\t' + types.slice(0, -1) + '};\n\nexport type RuleName<K = keyof SchemaRuleNames> = K;\n\nexport type SchemaField = SchemaRuleNames & {\n\toptional?: boolean;\n\tdefault?: any;\n\tcustom?: ValidationStep;\n\tschema?: Record<string, SchemaField>;\n\tmessages?: {\n\t\t[key in RuleName]?: string;\n\t};\n}';
// const ruleNames = 'export type RuleName = "' + Object.keys(ruleRegistry).join('"|"') + '";';

const outFile = path.join(__dirname, '../src/core/rule-name.ts')

writeFileSync(outFile, ruleNames);
