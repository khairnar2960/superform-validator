import { extractDateTime, ExtractedDateTime } from "../../utils/date-time.js";
import { BaseRule } from "./base-rule.js";

export class DateTimeRule extends BaseRule {
    constructor() {
        super('datetime', {
			name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['datetime'],
            validators: [
                {
                    callback: (value) => /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]) ([0-1][0-9]|2[0-3])\:([0-5][0-9])(?:\:([0-5][0-9]))?$/.test(String(value)),
                    message: '@{field} must be a valid datetime',
                }
            ]
		});

        this.registerFunction({
			name: 'before',
			paramType: 'single',
			argumentType: 'datetime',
			aliases: ['datetimeBefore'],
			validators: [
				{
					callback: (value: string, param: ExtractedDateTime) => extractDateTime(value).toDate() < param.toDate(),
					message: '@{field} must be before @{param}'
				}
			],
		});

		this.registerFunction({
			name: 'after',
			paramType: 'single',
			argumentType: 'datetime',
			aliases: ['datetimeAfter'],
			validators: [
				{
					callback: (value: string, param: ExtractedDateTime) => extractDateTime(value).toDate() > param.toDate(),
					message: '@{field} must be after @{param}'
				}
			],
		});

		this.registerFunction({
			name: 'equals',
			paramType: 'single',
			argumentType: 'datetime',
			aliases: ['datetimeEquals'],
			validators: [
				{
					callback: (value: string, param: ExtractedDateTime) => extractDateTime(value).toDate() > param.toDate(),
					message: '@{field} must be equal to @{param}'
				}
			],
		});

		this.registerFunction({
			name: 'between',
			paramType: 'range',
			argumentType: 'datetime',
			aliases: ['datetimeBetween'],
			validators: [
				{
					callback: (value: string, param: Record<string, ExtractedDateTime>) => {
						const val = extractDateTime(value).toDate();
						return val >= param.min.toDate() && val <= param.max.toDate();
					},
					message: '@{field} must be between @{param.min} and @{param.max}'
				}
			],
		});
		this.registerFunction({
			name: 'past',
			paramType: 'none',
			argumentType: 'datetime',
			aliases: ['datetimePast'],
			validators: [
				{
					callback: (value: string) => extractDateTime(value).toDate() < new Date(),
					message: '@{field} must be past datetime'
				}
			],
		});
		this.registerFunction({
			name: 'future',
			paramType: 'none',
			argumentType: 'datetime',
			aliases: ['datetimeFuture'],
			validators: [
				{
					callback: (value: string) => extractDateTime(value).toDate() > new Date(),
					message: '@{field} must be future datetime'
				}
			],
		});
    }
}
