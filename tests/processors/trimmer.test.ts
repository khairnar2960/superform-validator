import { describe, it, expect } from 'vitest';
import { Trimmer } from '../../src/core/processors/trimmer';

describe('Trimmer processor', () => {
    it('trims strings and leaves non-strings untouched', () => {
        const t = new Trimmer();
        expect(t.process('default', '  hello  ')).toBe('hello');
        const obj = { a: 1 };
        expect(t.process('default', obj)).toBe(obj);
    });
});
