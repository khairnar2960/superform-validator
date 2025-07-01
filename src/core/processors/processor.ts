import { toCamelCase } from "../../utils/case.js";
import { ArgumentDataType, ParamType, Signature, SignatureRecord } from "../rules/base-rule.js";

export type callback = (value: any) => any;

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
	 * Validate a value against a specific function in this rule.
	 * @param {any} value value to be validated
	 * @returns {any}
	 */
	process(value: any): any {
		if (Array.isArray(this.processors)) {
			for (const callback of this.processors) {
				if (callback) {
					value = callback(value);
				};
			}
		} else {
			value = this.processors(value);
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
	 * Validate a value against a specific function in this rule.
	 * @param {string} functionName Function name to be validate with
	 * @param {any} value value to be validated
	 * @returns {any}
	 */
	process(functionName: string, value: any): any {
		const func = this.functions.get(functionName);
		if (!func) throw new Error(`Function ${functionName} is not registered in ${this.type}`);
		return func.process(value);
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


new Processor('trim')