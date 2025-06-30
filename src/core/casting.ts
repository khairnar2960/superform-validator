"use strict";

import { Processor } from "./processor.js";

export class CastingProcessor extends Processor {

	constructor(isPreprocessor: boolean = false) {
        super('cast', isPreprocessor);

		this.registerFunction({
			name: 'integer',
			paramType: 'none',
			argumentType: 'any',
			aliases: [],
			processors: [
				(value) => parseInt(value, 10)
			],
			desc: ''
		});

		this.registerFunction({
			name: 'float',
			paramType: 'none',
			argumentType: 'any',
			aliases: [],
			processors: [
				(value) => parseFloat(value)
			],
			desc: ''
		});

		this.registerFunction({
			name: 'boolean',
			paramType: 'none',
			argumentType: 'any',
			aliases: [],
			processors: [
				(value) => {
					value = 'string' === typeof value ? value.toLowerCase() : value;
					return ['0', 'false'].includes(value) ? false : Boolean(value);
				}
			],
			desc: ''
		});

		this.registerFunction({
			name: 'tojson',
			paramType: 'none',
			argumentType: 'any',
			aliases: [],
			processors: [
				(value) => JSON.stringify(value)
			],
			desc: ''
		});

		this.registerFunction({
			name: 'fromjson',
			paramType: 'none',
			argumentType: 'any',
			aliases: [],
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