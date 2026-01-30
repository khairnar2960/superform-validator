import { toCamelCase } from "../../utils/case.js";
import type { ArgumentDataType, ParamType, Signature, SignatureRecord } from "../rules/base-rule.js";

export type callback = (value: any, param?: any) => any;

export interface ProcessorFuncSchema {
	name?: string;
	paramType: ParamType;
	argumentType: ArgumentDataType;
	aliases: string[];
	processors: callback | callback[];
	desc?: string
}

export class ProcessorFunc {
	name?: string;
	paramType: ParamType;
	argumentType: ArgumentDataType;
	aliases: string[];
	processors: callback | callback[];
	desc?: string

	constructor(schema: ProcessorFuncSchema) {
		this.name = schema.name;
		this.paramType = schema.paramType;
		this.argumentType = schema.argumentType;
		this.aliases = schema.aliases;
		this.processors = schema.processors;
		this.desc = schema.desc;
	}

	/**
	 * Process a value against a specific function in this rule.
	 * @param {any} value value to be processed
	 * @param {any} param processor parameter
	 * @returns {any}
	 */
	process(value: any, param?: any): any {
		if (Array.isArray(this.processors)) {
			for (const callback of this.processors) {
				if (callback) {
					value = callback(value, param);
				};
			}
		} else {
			value = this.processors(value, param);
		}

		return value;
	}
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
	 * @param {ProcessorFuncSchema} processorFunction Processor function definition
	 * @returns {this}
	 */
	registerFunction(processorFunction: ProcessorFuncSchema): this {
		this.functions.set(processorFunction.name || 'default', new ProcessorFunc(processorFunction));
		return this;
	}


	/**
	 * Process a value against a specific function in this rule.
	 * @param {string} functionName Function name to be processed with
	 * @param {any} value value to be processed
	 * @param {any} param processor parameter
	 * @returns {any}
	 */
	process(functionName: string, value: any, param?: any): any {
		const func = this.functions.get(functionName);
		if (!func) throw new Error(`Function ${functionName} is not registered in ${this.type}`);
		return func.process(value, param);
	}

	/**
	 * Generate function signatures for documentation.
	 */
	generateSignatures(): SignatureRecord {
		const signatures: SignatureRecord = {
			type: this.type,
			rules: [],
		};

		this.functions.forEach(func => {
			const baseSignature = toCamelCase((this.isPreprocessor ? 'pre ' : '') + this.type) + `${func.name && func.name !== 'default' ? '::' + func.name : '' }`;

			const rule: Signature = { name: baseSignature, aliases: [] };

			func.aliases.forEach(alias => {
				const aliasSignature = toCamelCase((this.isPreprocessor ? 'pre ' : '')  + alias);
				rule.aliases.push(aliasSignature);
			});

			signatures.rules.push(rule);
		});

		return signatures;
	}
}