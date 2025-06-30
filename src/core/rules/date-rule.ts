import { BaseRule } from "./base-rule.js";

export class DateRule extends BaseRule {
    constructor() {
        super('date', {
			name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['date'],
            validators: [
                {
                    callback: (value) => /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(String(value)) && !isNaN(Date.parse(value)),
                    message: '@{field} must be a valid date',
                }
            ]
		});

        this.registerFunction({
			name: 'before',
			paramType: 'single',
			argumentType: 'date',
			aliases: ['dateBefore'],
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
			argumentType: 'date',
			aliases: ['dateAfter'],
			validators: [
				{
					callback: (value, param) => new Date(value) > new Date(param),
					message: '@{field} must be after @{limit}'
				}
			],
		});

		this.registerFunction({
			name: 'equals',
			paramType: 'single',
			argumentType: 'date',
			aliases: ['dateEquals'],
			validators: [
				{
					callback: (value, param) => new Date(value) > new Date(param),
					message: '@{field} must exactly match the @{limit}'
				}
			],
		});

		this.registerFunction({
			name: 'between',
			paramType: 'range',
			argumentType: 'date',
			aliases: ['dateBetween'],
			validators: [
				{
					callback: (value, param) => new Date(value) >= param.min && new Date(value) <= param.max,
					message: '@{field} must be between @{min} and @{max}'
				}
			],
		});
    }
}
