import { SchemaField } from "./schema-parser.js";

type ValidCallback = (parsed: Record<string, any>) => void;
type InvalidCallback = (errors: Record<string, any>) => void;

interface ValidatorOptions {
    errorElement?: string,
    errorClass?: string,
    errorId?: string
}

export class Validator {
	constructor(
        form: HTMLFormElement|string,
        schema: SchemaField = {},
        onValid: ValidCallback|null = null,
        onError: InvalidCallback|null = null,
        options: ValidatorOptions = {}
    ) {
		//
	}
}
