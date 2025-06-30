"use strict";

import { Processor } from "./processor.js";

export class Trimmer extends Processor {

	constructor(isPreprocessor: boolean = false) {
        super('trim', isPreprocessor);

		this.registerFunction({
			name: 'default',
			paramType: 'none',
			argumentType: 'string',
			aliases: [],
			processors: [
				(value) => typeof value === 'string' ? value.trim() : value
			],
			desc: ''
		});
	}
}