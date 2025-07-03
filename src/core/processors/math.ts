"use strict";

import { Processor } from "./processor.js";

export class MathProcessor extends Processor {

	constructor(isPreprocessor: boolean = false) {
        super('math', isPreprocessor);

		this.registerFunction({
			name: 'ceil',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['ceil', 'roundUp'],
			processors: [
				(value) => Math.ceil(Number(value))
			],
			desc: 'Rounds up to the nearest integer'
		});

		this.registerFunction({
			name: 'floor',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['floor', 'roundDown'],
			processors: [
				(value) => Math.floor(Number(value))
			],
			desc: 'Rounds down to the nearest integer'
		});

		this.registerFunction({
			name: 'round',
			paramType: 'none',
			argumentType: 'any',
			aliases: ['round'],
			processors: [
				(value) => Math.round(Number(value))
			],
			desc: 'Rounds to the nearest integer'
		});

		this.registerFunction({
			name: 'toFixed',
			paramType: 'single',
			argumentType: 'integer',
			aliases: ['toFixed'],
			processors: [
				(value, param: number = 0) => Number(value).toFixed(param)
			],
			desc: 'Rounds to fixed decimal places'
		});
	}
}