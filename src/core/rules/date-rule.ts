import { extractDate, ExtractedDate } from "../../utils/date-time.js";
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
					callback: (value: string, param: ExtractedDate) => extractDate(value).toDate() < param.toDate(),
					message: '@{field} must be before @{param}'
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
					callback: (value: string, param: ExtractedDate) => extractDate(value).toDate() > param.toDate(),
					message: '@{field} must be after @{param}'
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
					callback: (value: string, param: ExtractedDate) => extractDate(value).toDate() > param.toDate(),
					message: '@{field} must exactly match the @{param}'
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
					callback: (value: string, param: Record<string, ExtractedDate>) => {
						const val = extractDate(value).toDate();
						return val >= param.min.toDate() && val <= param.max.toDate();
					},
					message: '@{field} must be between @{param.min} and @{param.max}'
				}
			],
		});
		this.registerFunction({
			name: 'today',
			paramType: 'none',
			argumentType: 'date',
			aliases: ['dateToday'],
			validators: [
				{
					callback: (value: string) => extractDate(value).toString() === (new Date()).toISOString().split('T')[0],
					message: '@{field} must be today\'s date'
				}
			],
		});
		this.registerFunction({
			name: 'past',
			paramType: 'none',
			argumentType: 'date',
			aliases: ['datePast'],
			validators: [
				{
					callback: (value: string) => extractDate(value).toDate() < new Date(),
					message: '@{field} must be past date'
				}
			],
		});
		this.registerFunction({
			name: 'future',
			paramType: 'none',
			argumentType: 'date',
			aliases: ['dateFuture'],
			validators: [
				{
					callback: (value: string) => extractDate(value).toDate() > new Date(),
					message: '@{field} must be future date'
				}
			],
		});
    }
}
