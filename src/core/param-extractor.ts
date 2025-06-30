export interface ParamSchema {
    name: string,
    func: string | null,
    param: string | null
};

export function extractParam(raw: string): ParamSchema {
    const match = raw.match(/^([a-zA-Z0-9:]+)(?:\((.+)\))?$/);
    if (!match) {
        const name = raw.trim();
        const [_,func = null] = name.split('::').map(n => n.trim());
        return { name: raw.trim(), func, param: null };
    }

    const name = match[1].trim();
    const [_,func = null] = name.split('::').map(n => n.trim());
    const param = match[2] ? match[2].trim() : null;

    return { name, func, param };
}


/*
import { ParamType } from "./rules/base-rule";

export interface ParamSchema {
	type: ParamType,
	name: string,
	value: any,
}

export function extractParam(rawParam: string | null ) {

	const param: ParamSchema = { type: 'none', name: '', value: null };

    if (!rawParam) return param;

	// const match = rawParam.match(/^([a-zA-Z0-9:]+)(?:\((.+)\))?$/);
    // if (!match) {
	// 	param.name = rawParam.trim();
    //     return param;
    // }

    // Match function-style: function(param)
    const functionMatch = rawParam.match(/^([a-zA-Z]+)\((.*?)\)$/);
    if (functionMatch) {
		param.type = "function";
		param.name = functionMatch[1];
		param.value = functionMatch[2];
        return param;
    }

    // Match multi-field dependency: field=value
    if (/^[a-zA-Z0-9_]+=[^=]+$/.test(rawParam)) {
        let [field, expected] = rawParam.split('=');
		param.type = "fieldEquals";
		param.value = { field: field.trim(), expected: expected.trim() };
        return param;
    }

    // Match simple field reference: otherField
    if (/^[a-zA-Z0-9_]+$/.test(rawParam)) {
		param.type = "fieldReference";
		param.value = { field: rawParam.trim() };
        return param;
    }

    // Match parenthesis with | or , separator
    if (/^\(.*\)$/.test(rawParam)) {
        const stripped = rawParam.replace(/[()]/g, '');
        const separator = stripped.includes('|') ? '|' : ',';
        const parts = stripped.split(separator).map(v => v.trim());

        if (parts.length === 2) {
			param.type = "range";
			param.value = { min: parts[0], max: parts[1] }
			return param;
		}

        if (parts.length > 2) {
			param.type = "list";
			param.value = { list: parts };
			return param;
		}
    }

    // Single value
	param.type = "single";
	param.value = rawParam.trim();
    return param;
}
*/