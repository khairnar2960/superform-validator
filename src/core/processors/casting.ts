"use strict";

import { Processor } from "./processor.js";

export class CastingProcessor extends Processor {

	constructor(isPreprocessor: boolean = false) {
        super('cast', isPreprocessor);

		this.registerFunction({
			name: 'string',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['toStr'],
			processors: [
				(value) => String(value)
			],
			desc: ''
		});
		
		this.registerFunction({
			name: 'integer',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['toInteger'],
			processors: [
				(value) => parseInt(value, 10)
			],
			desc: ''
		});

		this.registerFunction({
			name: 'float',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['toFloat'],
			processors: [
				(value) => parseFloat(value)
			],
			desc: ''
		});

		this.registerFunction({
			name: 'boolean',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['toBoolean'],
			processors: [
				(value) => {
					value = 'string' === typeof value ? value.toLowerCase() : value;
					return ['0', 'false'].includes(value) ? false : Boolean(value);
				}
			],
			desc: ''
		});

		this.registerFunction({
			name: 'toJson',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['toJson'],
			processors: [
				(value) => JSON.stringify(value)
			],
			desc: ''
		});

		this.registerFunction({
			name: 'fromJson',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['fromJson'],
			processors: [
				(value) => {
					try {
						return JSON.parse(value);
					} catch (error) {
						value;
					}
				}
			],
			desc: ''
		});
	}
}