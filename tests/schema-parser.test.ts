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
});