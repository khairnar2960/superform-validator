import { describe, it, expect } from 'vitest';
import { Random } from '../../src/utils/random';

describe('Random utilities', () => {
    it('string respects length and custom charset', () => {
        const s = Random.string(8, { charset: 'abc' });
		
        expect(s.length).toBe(8);
        for (const ch of s) expect('abc').toContain(ch);

        // empty charset should throw
        expect(() => Random.string(3, { charset: '' })).toThrow();
    });

    it('integer stays within bounds (inclusive)', () => {
        for (let i = 0; i < 50; i++) {
            const n = Random.integer(10, 20);
            expect(n).toBeGreaterThanOrEqual(10);
            expect(n).toBeLessThanOrEqual(20);
        }
    });

    it('float stays within bounds and respects decimals approximation', () => {
        for (let i = 0; i < 50; i++) {
            const f = Random.float(1.5, 2.5, 3);
            expect(f).toBeGreaterThanOrEqual(1.5 - 1e-9);
            expect(f).toBeLessThanOrEqual(2.5 + 1e-9);
        }
    });

    it('boolean returns boolean', () => {
        const b = Random.boolean();
        expect(typeof b).toBe('boolean');
    });

    it('fileExtension and mimeType formats', () => {
        const ext = Random.fileExtension();
        expect(ext.startsWith('.')).toBe(true);

        const mt = Random.mimeType();
        expect(mt).toContain('/');
    });

    it('date, time and dateTime formats', () => {
        const d = Random.date(new Date(2000, 0, 1), new Date(2000, 0, 10));
        expect(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d)).toBe(true);

        const t = Random.time();
        expect(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(t)).toBe(true);

        const iso = Random.dateTimeISO(new Date(2000, 0, 1), new Date(2000, 0, 10));
        expect(typeof iso).toBe('string');

        const dt = Random.dateTime(new Date(2000, 0, 1), new Date(2000, 0, 10));
        expect(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(dt)).toBe(true);
    });

    it('email and url look reasonable', () => {
        const email = Random.email();
        expect(email).toContain('@');

        const url = Random.url();
        expect(url.startsWith('https://www.')).toBe(true);
    });

    it('phone and telephone formats', () => {
        const phone = Random.phone('+91');
        expect(phone.startsWith('+91-')).toBe(true);

        const tel = Random.telephone('+91');
        expect(tel.startsWith('+91-')).toBe(true);
    });

    it('uuid, color and hash sizes', () => {
        const uuid = Random.uuid();
        expect(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)).toBe(true);

        const color = Random.color();
        expect(/^#[0-9a-f]{6}$/i.test(color)).toBe(true);

        expect(Random.hash('md5').length).toBe(32);
        expect(Random.hash('sha1').length).toBe(40);
        expect(Random.hash('sha256').length).toBe(64);
    });

    it('uniqueFromArray and fromArray behaviors', () => {
        expect(() => Random.fromArray([])).toThrow();

        const arr = [1, 2, 3, 4];
        const single = Random.fromArray(arr);
        expect(arr).toContain(single);

        const uniq = Random.uniqueFromArray(arr, 2);
        expect(uniq.length).toBeGreaterThanOrEqual(1);
        expect(uniq.length).toBeLessThanOrEqual(2);
        uniq.forEach(v => expect(arr).toContain(v));
    });

    it('uniqueValues throws for undefined generator and returns unique results otherwise', () => {
        expect(() => Random.uniqueValues(1, 'nonexistent' as any)).toThrow();

        // use 'string' generator to get unique strings
        const values = Random.uniqueValues(5, 'string', [6]);
        expect(values.length).toBeGreaterThanOrEqual(1);
        // ensure uniqueness
        const set = new Set(values);
        expect(set.size).toBe(values.length);
    });
});
