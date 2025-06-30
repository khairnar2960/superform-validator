export function parseParam(rawParam: string | null, paramType: string, argumentType: string) {
    if (rawParam === null) return null;

    switch (paramType) {
        case 'single':
            return parseSingleParam(rawParam, argumentType);
        case 'range':
            return parseRangeParam(rawParam, argumentType);
        case 'list':
            return parseListParam(rawParam);
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

function parseSingleParam(raw: string, argumentType: string): string|number|boolean {
    if (argumentType === 'integer') {
        if (isNaN(parseInt(raw))) throw new Error(`Invalid integer value ${raw}`);
        return parseInt(raw);
    }
    if (argumentType === 'float') {
        if (isNaN(parseFloat(raw))) throw new Error(`Invalid float value ${raw}`);
        return parseFloat(raw);
    }
    if (argumentType === 'boolean') {
        raw = 'string' === typeof raw ? raw.toLowerCase() : raw;
		return ['0', 'false'].includes(raw) ? false : Boolean(raw);
    }
    return raw;
}

function parseRangeParam(raw: string, argumentType: string) {
    const cleaned = raw.replace(/[()]/g, '');
    const [min, max] = cleaned.split(/[,|\|]/).map((v) => parseSingleParam(v.trim(), argumentType));
    return { min, max };
}

function parseListParam(raw: string) {
    return raw.split(/[,|\|]/).map(v => v.trim());
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
