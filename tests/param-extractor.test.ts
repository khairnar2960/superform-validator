import { describe, it, expect } from 'vitest';
import { extractParam } from '../src/core/param-extractor';

describe('Param Extractor', () => {
	it('handles ', () => {
		expect(extractParam('maxFiles(2)')).toMatchObject({ func: null, name: 'maxFiles', param: '2' });
		expect(extractParam('minSize(2mb)')).toMatchObject({ func: null, name: 'minSize', param: '2mb' });
		expect(extractParam('file::maxFiles(2)')).toMatchObject({ func: 'maxFiles', name: 'file::maxFiles', param: '2' });
	})
});