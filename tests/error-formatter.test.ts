import { describe, it, expect } from 'vitest';
import { ErrorFormatter } from '../src/core/error-formatter';

describe('ErrorFormatter', () => {
	it('formats simple template with flat placeholders', () => {
        expect(ErrorFormatter.format(
			'Hello, @{name}!',
			{ name: 'Sameer' }
		)).toBe('Hello, Sameer!');
    });

    it('formats template with nested placeholders', () => {
        expect(ErrorFormatter.format(
			'User: @{user.name}, Age: @{user.age}',
			{ user: { name: 'Ravi', age: 30 } }
		)).toBe('User: Ravi, Age: 30');
    });

    it('handles array indices', () => {
        expect(ErrorFormatter.format(
			'First: @{items[0]}, Second: @{items[1]}',
			{ items: ['One', 'Two'] }
		)).toBe('First: One, Second: Two');
    });

	it('handles fallback when array element is missing', () => {
		expect(ErrorFormatter.format(
			'Item: @{items[1] || "DefaultItem"}',
			{ items: ['FirstItem'] }
		)).toBe('Item: DefaultItem');
	});

    it('uses default fallback for missing values', () => {
        expect(ErrorFormatter.format(
			'User: @{user.name || "Guest"}', {}
		)).toBe('User: Guest');
    });

    it('handles null/undefined values gracefully', () => {
        expect(ErrorFormatter.format(
			'Missing: @{user.name}', { user: {} }
		)).toBe('Missing: ');
    });

    it('trims string values using trim modifier', () => {
        expect(ErrorFormatter.format(
			'Name: @{user.name | trim}', { user: { name: '  Rahul  ' } }
		)).toBe('Name: Rahul');
    });

	it('lowers the case using lower modifier', () => {
        expect(ErrorFormatter.format(
			'Name: @{user.name | lower}', { user: { name: 'RAHUL' } }
		)).toBe('Name: rahul');
    });
	
	it('uppers the case using upper modifier', () => {
        expect(ErrorFormatter.format(
			'Name: @{user.name | upper}', { user: { name: 'rahul' } }
		)).toBe('Name: RAHUL');
    });
	
	it('capitalizes the case using capitalize modifier', () => {
        expect(ErrorFormatter.format(
			'Name: @{user.name | capitalize}', { user: { name: 'rahul' } }
		)).toBe('Name: Rahul');
    });

	it('applies upper modifier', () => {
		expect(ErrorFormatter.format(
			'Name: @{user.name | upper}', { user: { name: 'ravi' } }
		)).toBe('Name: RAVI');
	});

	it('applies multiple modifiers', () => {
		expect(ErrorFormatter.format(
			'Name: @{user.name | trim | capitalize}', { user: { name: '  john' } }
		)).toBe('Name: John');
	});

	it('handles fallback with modifier', () => {
		expect(ErrorFormatter.format(
			'User: @{user.name || user.username | upper || "Guest"}',
			{ user: { username: 'fallback' } }
		)).toBe('User: FALLBACK');
	});

	it('handles fallback with quoted strings and spaces', () => {
		expect(ErrorFormatter.format(
			'Role: @{user.role || "  Admin  " | trim}', { user: {} }
		)).toBe('Role: Admin');
	});

    it('joins array values as string', () => {
        expect(ErrorFormatter.format(
			'Tags: @{post.tags}', { post: { tags: ['alpha', 'beta'] } }
		)).toBe('Tags: alpha, beta');
    });

	it('formats multiple placeholders correctly in one string', () => {
		expect(ErrorFormatter.format(
			'User: @{user.name}, City: @{user.city}, Age: @{user.age}',
			{ user: { name: 'Amit', city: 'Mumbai', age: 28 } }
		)).toBe('User: Amit, City: Mumbai, Age: 28');
	});

    it('handles deep nesting', () => {
        expect(ErrorFormatter.format(
			'City: @{user.address.location.city}',
			{ user: { address: { location: { city: 'Pune' } } } }
		)).toBe('City: Pune');
    });

    it('handles nested with bracketed path', () => {
        expect(ErrorFormatter.format(
			'Access: @{config[env].mode}',
			{ config: { env: { mode: 'debug' } } }
		)).toBe('Access: debug');
    });

    it('handles fallback value with || operator', () => {
        expect(ErrorFormatter.format(
			'Name: @{profile.name || "Anonymous"}',
			{ profile: {} }
		)).toBe('Name: Anonymous');
    });

	it('handles fallback with nested object path', () => {
		expect(ErrorFormatter.format(
			'User: @{user.name || user.username || "Guest"}',
			{ user: { username: 'FallbackName' } }
		)).toBe('User: FallbackName');
	});

    it('returns template as is if no placeholders found', () => {
        expect(ErrorFormatter.format(
			'No dynamic content here.'
		)).toBe('No dynamic content here.');
    });

    it('ignores malformed expressions', () => {
        expect(ErrorFormatter.format(
			'Broken: @{user.[name]}', 
			{ user: { name: 'Oops' } }
		)).toBe('Broken: ');
    });

	it('fails gracefully on unsupported special characters in placeholder', () => {
		expect(ErrorFormatter.format(
			'Test: @{user.name*invalid}', { user: { name: 'Test' } }
		)).toBe('Test: ');
	});

    it('returns empty string for completely invalid expressions', () => {
        expect(ErrorFormatter.format('@{::invalid-expression}')).toBe('');
    });
});