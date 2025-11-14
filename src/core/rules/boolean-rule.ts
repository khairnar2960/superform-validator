import { BaseRule } from "./base-rule.js";
import { isBoolean } from "./core-rules.js";

export class BooleanRule extends BaseRule {

    constructor() {
        super('boolean', {
            name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['boolean', 'bool'],
            validators: [
                {
                    callback: (value) => isBoolean(value),
                    message: '@{field} must be a valid boolean',
                }
            ]
        });
    }
}
