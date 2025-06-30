import { BaseRule } from "./base-rule.js";

export class TimeRule extends BaseRule {
    constructor() {
        super('time', {
			name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['time'],
            validators: [
                {
                    callback: (value) => /^([0-1][0-9]|2[0-3])\:([0-5][0-9])(?:\:([0-5][0-9]))?$/.test(String(value)),
                    message: '@{field} must be a valid time',
                }
            ]
		});

        this.registerFunction({
			name: 'before',
			paramType: 'single',
			argumentType: 'time',
			aliases: ['timeBefore'],
			validators: [
				{
					callback: (value, param) => new Date(value) < new Date(param),
					message: '@{field} must be before @{limit}'
				}
			],
		});

		this.registerFunction({
			name: 'after',
			paramType: 'single',
			argumentType: 'time',
			aliases: ['timeAfter'],
			validators: [
				{
					callback: (value, param) => new Date(value) > new Date(param),
					message: '@{field} must be after @{limit}'
				}
			],
		});
    }
}
