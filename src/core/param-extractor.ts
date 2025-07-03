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