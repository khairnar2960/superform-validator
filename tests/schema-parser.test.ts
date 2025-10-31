import { describe, expect, it } from "vitest";
import { parseSchema } from "../src/core/schema-parser";

describe('Schema Parser', () => {

	it('should parse empty schema', () => {
		expect(parseSchema({})).toEqual({});
	});
	
	it('should parse string schema', () => {
		expect(parseSchema({ email: 'require'})).toHaveProperty('email[0].name', 'require');
		expect(parseSchema({ email: 'require'})).toHaveProperty('email[0].type', 'field');
		expect(parseSchema({ email: 'require'})).toHaveProperty('email[0].param', true);
	});

	it('should parse object schema with default and custom pattern', () => {
		const parsed = parseSchema({ name: { default: 'john', custom: { pattern: /^(john|doe)$/i, message: 'bad' } } });
		expect(parsed).toHaveProperty('name');
		expect(parsed.name[0]).toEqual(expect.objectContaining({ name: 'default', type: 'value', param: 'john' }));
		expect(parsed.name[1]).toEqual(expect.objectContaining({ name: 'custom', type: 'pattern' }));
		// pattern should be a RegExp inside param
		expect(parsed.name[1].param).toHaveProperty('pattern');
		expect(parsed.name[1].param.pattern).toBeInstanceOf(RegExp);
	});

	it('throws for invalid custom rule object', () => {
		expect(() => parseSchema({ f: { custom: { foo: 'bar' } as any } })).toThrow();
	});
});