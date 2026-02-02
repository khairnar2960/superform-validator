import { extractDate, extractDateTime, ExtractedDate, ExtractedDateTime, ExtractedTime, extractTime } from "../utils/date-time.js";

export function parseParam(rawParam: string | null, paramType: string, argumentType: string) {
    if (paramType === 'none') {
        return rawParam === null ? true : Boolean(rawParam);
    }

    if (rawParam === null) return null;

    switch (paramType) {
        case 'single':
            return parseSingleParam(rawParam, argumentType);
        case 'range':
            return parseRangeParam(rawParam, argumentType);
        case 'list':
            return parseListParam(rawParam, argumentType);
        case 'fileSize':
            return parseFileSize(rawParam);
        case 'fieldReference':
            return rawParam; // field name
        case 'fieldEquals':
            const [field, value] = rawParam.split('=');
            return { field: field.trim(), value: value.trim() };
        case 'function':
            return rawParam;
        default:
            return rawParam;
    }
}

function parseSingleParam(raw: string, argumentType: string): string|any[]|number|boolean|ExtractedDate|ExtractedTime|ExtractedDateTime {
    if (argumentType === 'string') {
        return String(raw);
    } else if (argumentType === 'number') {
        if (isNaN(Number(raw)) || !Number.isFinite(Number(raw))) throw new Error(`Invalid number value ${raw}`);
        return Number(raw);
    } else if (argumentType === 'integer') {
        if (isNaN(parseInt(raw))) throw new Error(`Invalid integer value ${raw}`);
        return parseInt(raw);
    } else if (argumentType === 'float') {
        if (isNaN(parseFloat(raw))) throw new Error(`Invalid float value ${raw}`);
        return parseFloat(raw);
    } else if (argumentType === 'boolean') {
        raw = 'string' === typeof raw ? raw.toLowerCase() : raw;
		return ['0', 'false'].includes(raw) ? false : Boolean(raw);
    } else if (['date', 'datetime'].includes(argumentType)) {
        if (isNaN(Date.parse(raw))) throw new Error(`Invalid ${argumentType} value ${raw}`);

        if (argumentType === 'datetime') {
            return extractDateTime(raw);
        }
        return extractDate(raw);
    } else if (argumentType === 'time') {
        return extractTime(raw);
    } else if (argumentType === 'array') {
        if ('string' === typeof raw) {
            return raw.split(',').map(v => v.trim());
        }
        if (!Array.isArray(raw)) {
            throw new Error("Invalid array");
        }
        return raw;
    }
    return raw;
}

function parseRangeParam(raw: string, argumentType: string) {
    const cleaned = raw.replace(/[\(\)]/g, '');
    const [min, max] = cleaned.split(/[,|\|]/).map((v) => parseSingleParam(v.trim(), argumentType));
    return { min, max };
}

function parseListParam(raw: string, argumentType: string) {
    return raw.replace(/[\(\)]/g, '').split(/[,|\|]/).map(v => parseSingleParam(v.trim(), argumentType));
}

function parseFileSize(raw: string): { raw: string, size: number, unit: string, bytes: number } {
    const sizeUnits: Record<string, number> = { bytes: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
    const match = raw.match(/^([0-9]+)(bytes|kb|mb|gb)?$/i);
    if (!match) throw new Error('Invalid file size format');
    const size = parseInt(match[1], 10);
    const unit = match[2]?.toLowerCase() || 'bytes';
    const bytes = size * (sizeUnits[unit] || 1);
	return { raw, size, unit, bytes };
}
