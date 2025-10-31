import { describe, it, expect } from 'vitest';
import { Processor } from '../../src/core/processors/processor';

describe('Processor base', () => {
    it('ProcessorFunc.process applies single and array processors', () => {
        const proc = new Processor('test');
        proc.registerFunction({
            name: 'default',
            paramType: 'none',
            argumentType: 'any',
            aliases: ['def'],
            processors: [(v: any) => v + 'a']
        });

        expect(proc.process('default', 'x')).toBe('xa');

        proc.registerFunction({
            name: 'chain',
            paramType: 'none',
            argumentType: 'any',
            aliases: [],
            processors: [
                (v: any) => v + '1',
                (v: any) => v + '2',
            ]
        });

        expect(proc.process('chain', 'x')).toBe('x12');
    });

    it('generateSignatures returns signature records and includes aliases', () => {
        const proc = new Processor('case', false);
        proc.registerFunction({
            name: 'lower',
            paramType: 'none',
            argumentType: 'string',
            aliases: ['toLowercase'],
            processors: [(v: string) => v.toLowerCase()]
        });

        const sig = proc.generateSignatures();
        expect(sig).toHaveProperty('type', 'case');
        expect(Array.isArray(sig.rules)).toBe(true);
        expect(sig.rules[0]).toHaveProperty('name');
        expect(sig.rules[0].aliases.length).toBeGreaterThanOrEqual(0);
    });
});
