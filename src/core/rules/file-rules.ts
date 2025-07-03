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
            name: 'minFiles',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['minFiles'],
            validators: [
                {
                    callback: (value, param) =>  Array.from(value || []).length >= param,
                    message: 'Select at least @{param} files'
                }
            ],
        });
        this.registerFunction({
            name: 'maxFiles',
            paramType: 'single',
            argumentType: 'integer',
            aliases: ['maxFiles'],
            validators: [
                {
                    callback: (value, param) =>  Array.from(value || []).length <= param,
                    message: 'Maximum @{param} files allowed for @{field}'
                }
            ],
        });
        this.registerFunction({
            name: 'minSize',
            paramType: 'fileSize',
            argumentType: 'string',
            aliases: ['minFileSize'],
            validators: [
                {
                    callback: (value, param) =>  (Array.from(value || []) as Record<string, any>[]).every(file => (file?.size || 0) >= param.bytes),
                    message: 'Each file must be at least @{param.raw}'
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
                    callback: (value, param) =>  (Array.from(value || []) as Record<string, any>[]).every(file => (file?.size || 0) <= param.bytes),
                    message: '@{field} exceeds maximum limit of @{param.raw}'
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
                    message: 'Invalid file. Only (@{param}) allowed'
                }
            ],
        });
    }
}