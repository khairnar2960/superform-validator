import { toCamelCase } from "../utils/case.js";
import { ArgumentDataType, ParamType } from "./rules/base-rule.js";

export type callback = (value: any) => any;

export interface ProcessorFunc {
	name?: string;
	paramType: ParamType;
	argumentType: ArgumentDataType;
	aliases: string[];
	processors: callback | callback[];
	desc?: string
}

export class Processor {
	isPreprocessor: boolean;
	type: string;
	functions: Map<string, ProcessorFunc>;

	/**
	 * @param {string} type Processor type e.g. trim|cast|case
	 */
	constructor(type: string, isPreprocessor: boolean = false) {
		this.isPreprocessor = isPreprocessor;
		this.type = type;
		this.functions = new Map();
	}

	/**
	 * Register a new function for this processor type.
	 * @param {ProcessorFunc} processorFunction Processor function definition
	 * @returns {this}
	 */
	registerFunction(processorFunction: ProcessorFunc): this {
		this.functions.set(processorFunction.name || 'default', processorFunction);
		return this;
	}


	/**
	 * Validate a value against a specific function in this rule.
	 * @param {string} functionName Function name to be validate with
	 * @param {any} value value to be validated
	 * @returns {any}
	 */
	process(functionName: string, value: any): any {
		const func = this.functions.get(functionName);

		if (!func) throw new Error(`Function ${functionName} is not registered in ${this.type}`);

		if (Array.isArray(func.processors)) {
			for (const callback of func.processors) {
				if (callback) {
					value = callback(value);
				};
			}
		} else {
			value = func.processors(value);
		}

		return value;
	}

	/**
	 * Generate function signatures for documentation.
	 */
	generateSignatures(): string[] {
		const signatures: string[] = [];
		this.functions.forEach(func => {
			const baseSignature = toCamelCase((this.isPreprocessor ? 'pre ' : '') + this.type) + `${func.name && func.name !== 'default' ? '::' + func.name : '' }`;
			signatures.push(baseSignature);

			func.aliases.forEach(alias => {
				const aliasSignature = toCamelCase((this.isPreprocessor ? 'pre ' : '')  + alias);
				signatures.push(aliasSignature);
			});
		});
		return signatures;
	}
}


new Processor('trim')