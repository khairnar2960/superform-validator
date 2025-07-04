import { describe, it, expect } from 'vitest';
import { parseParam } from '../src/core/param-parser';
import { extractDate } from '../src/utils/date-time';

describe('ParamParser', () => {

	it('should parse single integer', () => {
		expect(parseParam('12', 'single', 'integer')).toBe(12);
	});
	
	it('should parse integer range', () => {
		expect(parseParam('12 | 25', 'range', 'integer')).toEqual({ min: 12, max: 25 });
		expect(parseParam('12 , 25', 'range', 'integer')).toEqual({ min: 12, max: 25 });
		expect(parseParam('(12 , 25)', 'range', 'integer')).toEqual({ min: 12, max: 25 });
	});
	
	it('should parse integer list', () => {
		expect(parseParam('12 | 25 | 30 | 50', 'list', 'integer')).toEqual([12, 25, 30, 50]);
		expect(parseParam('12 , 25 , 30 , 50', 'list', 'integer')).toEqual([12, 25, 30, 50]);
		expect(parseParam('(12 , 25 , 30 , 50)', 'list', 'integer')).toEqual([12, 25, 30, 50]);
	});

	it('should parse single date', () => {
		expect(parseParam('2025-07-04', 'single', 'date')).toEqual(extractDate('2025-07-04'));
	});
	
	it('should parse field references', () => {
		expect(parseParam('password', 'fieldReference', 'string')).toEqual('password');
	});

	it('should parse field reference & value', () => {
		expect(parseParam('name=john', 'fieldEquals', 'string')).toEqual({ field: 'name', value: 'john'});
	});
});