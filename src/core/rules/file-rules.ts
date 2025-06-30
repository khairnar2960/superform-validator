import { BaseRule } from "./base-rule.js";

export class FileRule extends BaseRule {
    constructor() {
        super('file', {
            name: 'file',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['file'],
            validators: [
                {
                    callback: (value: any) => !(value === null || value === undefined || value === ''),
                    message: '@{field} must be file',
                }
            ]
        });

        this.registerFunction({
            name: 'maxFiles',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['maxFiles'],
            validators: [
                {
                    callback: (value, param) =>  Array.from(value || []).length <= param,
                    message: 'Maximum @{limit} files allowed for @{field}'
                }
            ],
        });
        this.registerFunction({
            name: 'maxSize',
            paramType: 'fileSize',
            argumentType: 'string',
            aliases: ['maxFileSize'],
            validators: [
                {
                    callback: (value, param) =>  (Array.from(value || []) as Record<string, any>[]).every(file => (file?.size || 0) <= param),
                    message: '@{field} exceeds maximum limit of @{limit}'
                }
            ],
        });
		this.registerFunction({
            name: 'accepts',
            paramType: 'list',
            argumentType: 'string',
            aliases: ['fileAccepts'],
            validators: [
                {
                    callback: (value: Record<string, any>[], param: string[]) => {
						return value.every(file => {
							return param.includes(file?.extension || '') || param.includes(file?.type || '');
						});
					},
                    message: 'Invalid file. Only (@{types}) allowed'
                }
            ],
        });
    }
}