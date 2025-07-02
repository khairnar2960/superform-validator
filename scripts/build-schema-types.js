import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { writeFileSync } from "fs";
import { ruleRegistry } from "../dist/core/rule-registry.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ruleNames = 'export type RuleName = "' + Object.keys(ruleRegistry).join('"|"') + '";';

const outFile = path.join(__dirname, '../src/core/rule-name.ts')

writeFileSync(outFile, ruleNames);
