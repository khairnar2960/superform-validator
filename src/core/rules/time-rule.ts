import { ExtractedTime, extractTime } from "../../utils/date-time.js";
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
                    callback: (value) => /^([0-1][0-9]|2[0-3])\:([0-5][0-9])(?:\:([0-5][0-9]))?$/.test(String(value)) && !isNaN(Date.parse(`1970-01-01 ${value}`)),
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
					callback: (value: string, param: ExtractedTime) => extractTime(value).toDate() < param.toDate(),
					message: '@{field} must be before @{param}'
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
					callback: (value: string, param: ExtractedTime) => extractTime(value).toDate() > param.toDate(),
					message: '@{field} must be after @{param}'
				}
			],
		});

		this.registerFunction({
			name: 'equals',
			paramType: 'single',
			argumentType: 'time',
			aliases: ['timeEquals'],
			validators: [
				{
					callback: (value: string, param: ExtractedTime) => extractTime(value).toDate() > param.toDate(),
					message: '@{field} must be equal to @{param}'
				}
			],
		});

		this.registerFunction({
			name: 'between',
			paramType: 'range',
			argumentType: 'time',
			aliases: ['timeBetween'],
			validators: [
				{
					callback: (value: string, param: Record<string, ExtractedTime>) => {
						const val = extractTime(value).toDate();
						return val >= param.min.toDate() && val <= param.max.toDate();
					},
					message: '@{field} must be between @{param.min} and @{param.max}'
				}
			],
		});
    }
}
