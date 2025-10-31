import { describe, it, expect } from 'vitest';
import { FileRule } from '../../src/core/rules/file-rules';

function makeFile(ext = '.png', type = 'image/png', size = 100) {
    return { file: true, name: `f${ext}`, size, type, extension: ext };
}

describe('FileRule', () => {
    it('valid accepts well-formed files and rejects empty arrays', () => {
        const rule = new FileRule();
        const files = [makeFile()];
        const ok = rule.validate('valid', files, undefined, {} as any);
        expect(ok.valid).toBe(true);

        const bad = rule.validate('valid', [], undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} must be valid files');
    });

    it('minFiles and maxFiles enforce counts', () => {
        const rule = new FileRule();
        const files = [makeFile(), makeFile()];

        const okMin = rule.validate('minFiles', files, 1, {} as any);
        expect(okMin.valid).toBe(true);

        const badMin = rule.validate('minFiles', files, 3, {} as any);
        expect(badMin.valid).toBe(false);

        const okMax = rule.validate('maxFiles', files, 3, {} as any);
        expect(okMax.valid).toBe(true);

        const badMax = rule.validate('maxFiles', files, 1, {} as any);
        expect(badMax.valid).toBe(false);
    });

    it('minSize and maxSize check cumulative size', () => {
        const rule = new FileRule();
        const files = [makeFile('.png', 'image/png', 100), makeFile('.jpg', 'image/jpg', 200)];

        const okMin = rule.validate('minSize', files, { bytes: 300, raw: '300B' }, {} as any);
        expect(okMin.valid).toBe(true);

        const badMin = rule.validate('minSize', files, { bytes: 500, raw: '500B' }, {} as any);
        expect(badMin.valid).toBe(false);

        const okMax = rule.validate('maxSize', files, { bytes: 500, raw: '500B' }, {} as any);
        expect(okMax.valid).toBe(true);

        const badMax = rule.validate('maxSize', files, { bytes: 200, raw: '200B' }, {} as any);
        expect(badMax.valid).toBe(false);
    });

    it('accepts and noAccepts filter by extension/type', () => {
        const rule = new FileRule();
        const files = [makeFile('.png', 'image/png', 100)];

        const ok = rule.validate('accepts', files, ['.png', 'image/png'], {} as any);
        expect(ok.valid).toBe(true);

        const bad = rule.validate('accepts', files, ['.jpg'], {} as any);
        expect(bad.valid).toBe(false);

        const okNo = rule.validate('noAccepts', files, ['.jpg'], {} as any);
        expect(okNo.valid).toBe(true);

        const badNo = rule.validate('noAccepts', files, ['.png'], {} as any);
        expect(badNo.valid).toBe(false);
    });

    it('imageOnly/videoOnly/audioOnly validate types', () => {
        const rule = new FileRule();
        const img = [makeFile('.png', 'image/png', 10)];
        const vid = [makeFile('.mp4', 'video/mp4', 10)];
        const aud = [makeFile('.mp3', 'audio/mpeg', 10)];

        expect(rule.validate('imageOnly', img, undefined, {} as any).valid).toBe(true);
        expect(rule.validate('imageOnly', vid, undefined, {} as any).valid).toBe(false);

        expect(rule.validate('videoOnly', vid, undefined, {} as any).valid).toBe(true);
        expect(rule.validate('videoOnly', aud, undefined, {} as any).valid).toBe(false);

        expect(rule.validate('audioOnly', aud, undefined, {} as any).valid).toBe(true);
        expect(rule.validate('audioOnly', img, undefined, {} as any).valid).toBe(false);
    });
});
