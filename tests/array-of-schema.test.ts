import { describe, it, expect } from 'vitest';
import { parseSchema, RawSchema } from '../src/core/schema-parser';
import { validate } from '../src/core/validator-engine';

describe('arrayOfSchema', () => {
    it('validates array items against nested schema and returns processed items', async () => {
        const raw: RawSchema = {
            users: {
                arrayOfSchema: {
                    name: {
                        require: true,
                    },
                    age: {
                        require: true,
                        integer: true,
                    },
                }
            }
        };

        const parsed = parseSchema(raw);

        const data = {
            users: [
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 }
            ]
        };

        const res1 = await validate(parsed, { users: {}});
        expect(res1.users.valid).toBe(false);
        expect(res1.users.error).toBe('Users must be an array');

        const res2 = await validate(parsed, { users: [1,2]});
        expect(res2.users.valid).toBe(false);
        expect(res2.users.error).toBe('Users must be an array of object');

        const res = await validate(parsed, data);
        expect(res).toHaveProperty('users');
        expect(res.users.valid).toBe(true);
        expect(Array.isArray(res.users.processedValue)).toBe(true);
        expect(res.users.processedValue.length).toBe(2);
        expect(res.users.processedValue[0]).toEqual(expect.objectContaining({ name: 'Alice', age: 30 }));
    });

    it('returns per-index children when an item fails schema validation', async () => {
        const raw = {
            users: {
                arrayOfSchema: {
                    name: 'require',
                    age: 'integer',
                }
            }
        } as any;

        const parsed = parseSchema(raw);

        const data = {
            users: [
                { age: 30 }, // missing name
                { name: 'Bob', age: 25 }
            ]
        } as any;

        const res = await validate(parsed, data);
        expect(res.users.valid).toBe(false);
        expect(res.users).toHaveProperty('children');
        const children = res.users.children || {};
        expect(children).toHaveProperty('0');
        const item0 = children['0'];
        expect(item0.valid).toBe(false);
        // nested field errors should be present
        expect(item0.children).toHaveProperty('name');
        expect(item0.children!.name.error).toEqual(expect.stringContaining('required'));
    });
});
