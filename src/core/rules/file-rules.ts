import { BaseRule } from "./base-rule.js";
import { isArray, isEmpty, isObject } from "./core-rules.js";

export class FileRule extends BaseRule {
    constructor() {
        super('file', {
            name: 'valid',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['file'],
            validators: [
                {
                    callback: (value: any) => !isEmpty(value) && isArray(value) && value.every((file: any) => {
                        return isObject(file) && ['file', 'name', 'size', 'type', 'extension'].every(prop => 'undefined' !== typeof file[prop])
                    }),
                    message: '@{field} must be valid files',
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
                    message: '@{field} must have at least @{param} files'
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
                    message: '@{field} can have maximum @{param} files'
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
                    callback: (value, param) =>  (Array.from(value || []) as Record<string, any>[]).reduce((total, file) => total + (file?.size || 0), 0) >= param.bytes,
                    message: '@{field} must be larger than @{param.raw}'
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
                    callback: (value, param) =>  (Array.from(value || []) as Record<string, any>[]).reduce((total, file) => total + (file?.size || 0), 0) <= param.bytes,
                    message: '@{field} must be smaller than @{param.raw}'
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
                    message: '@{field} only accepts (@{param}) files'
                }
            ],
        });
        this.registerFunction({
            name: 'noAccepts',
            paramType: 'list',
            argumentType: 'string',
            aliases: ['fileNotAccepts'],
            validators: [
                {
                    callback: (value: Record<string, any>[], param: string[]) => {
						return !value.some(file => {
							return param.includes(file?.extension || '') || param.includes(file?.type || '');
						});
					},
                    message: '@{field} not accepts (@{param}) files'
                }
            ],
        });
        this.registerFunction({
            name: 'imageOnly',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['fileImageOnly'],
            validators: [
                {
                    callback: (value: Record<string, any>[]) => {
						return value.every(file => {
							return String(file?.type || '').startsWith('image/');
						});
					},
                    message: '@{field} accepts image files only'
                }
            ],
        });
        this.registerFunction({
            name: 'videoOnly',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['fileVideoOnly'],
            validators: [
                {
                    callback: (value: Record<string, any>[]) => {
						return value.every(file => {
							return String(file?.type || '').startsWith('video/');
						});
					},
                    message: '@{field} accepts video files only'
                }
            ],
        });
        this.registerFunction({
            name: 'audioOnly',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['fileAudioOnly'],
            validators: [
                {
                    callback: (value: Record<string, any>[]) => {
						return value.every(file => {
							return String(file?.type || '').startsWith('audio/');
						});
					},
                    message: '@{field} accepts audio files only'
                }
            ],
        });
    }
}