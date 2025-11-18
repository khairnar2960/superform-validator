import { describe, it, expect } from 'vitest';
import { FileRule } from '../../src/core/rules/file-rules';

function makeFile(ext = '.png', type = 'image/png', size = 100) {
    return { file: true, name: `f${ext}`, size, type, extension: ext };
}

describe('FileRule', async () => {
    it('valid accepts well-formed files and rejects empty arrays', async () => {
        const rule = new FileRule();
        const files = [makeFile()];
        const ok = await rule.validate('valid', files, undefined, {} as any);
        expect(ok.valid).toBe(true);

        const bad = await rule.validate('valid', [], undefined, {} as any);
        expect(bad.valid).toBe(false);
        expect(bad.error).toBe('@{field} must be valid files');
    });

    it('minFiles and maxFiles enforce counts', async () => {
        const rule = new FileRule();
        const files = [makeFile(), makeFile()];

        const okMin = await rule.validate('minFiles', files, 1, {} as any);
        expect(okMin.valid).toBe(true);

        const badMin = await rule.validate('minFiles', files, 3, {} as any);
        expect(badMin.valid).toBe(false);

        const okMax = await rule.validate('maxFiles', files, 3, {} as any);
        expect(okMax.valid).toBe(true);

        const badMax = await rule.validate('maxFiles', files, 1, {} as any);
        expect(badMax.valid).toBe(false);
    });

    it('minSize and maxSize check cumulative size', async () => {
        const rule = new FileRule();
        const files = [makeFile('.png', 'image/png', 100), makeFile('.jpg', 'image/jpg', 200)];

        const okMin = await rule.validate('minSize', files, { bytes: 300, raw: '300B' }, {} as any);
        expect(okMin.valid).toBe(true);

        const badMin = await rule.validate('minSize', files, { bytes: 500, raw: '500B' }, {} as any);
        expect(badMin.valid).toBe(false);

        const okMax = await rule.validate('maxSize', files, { bytes: 500, raw: '500B' }, {} as any);
        expect(okMax.valid).toBe(true);

        const badMax = await rule.validate('maxSize', files, { bytes: 200, raw: '200B' }, {} as any);
        expect(badMax.valid).toBe(false);
    });

    it('accepts and noAccepts filter by extension/type', async () => {
        const rule = new FileRule();
        const files = [makeFile('.png', 'image/png', 100)];

        const ok = await rule.validate('accepts', files, ['.png', 'image/png'], {} as any);
        expect(ok.valid).toBe(true);

        const bad = await rule.validate('accepts', files, ['.jpg'], {} as any);
        expect(bad.valid).toBe(false);

        const okNo = await rule.validate('noAccepts', files, ['.jpg'], {} as any);
        expect(okNo.valid).toBe(true);

        const badNo = await rule.validate('noAccepts', files, ['.png'], {} as any);
        expect(badNo.valid).toBe(false);
    });

    it('imageOnly/videoOnly/audioOnly validate types', async () => {
        const rule = new FileRule();
        const img = [makeFile('.png', 'image/png', 10)];
        const vid = [makeFile('.mp4', 'video/mp4', 10)];
        const aud = [makeFile('.mp3', 'audio/mpeg', 10)];

        expect((await rule.validate('imageOnly', img, undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('imageOnly', vid, undefined, {} as any)).valid).toBe(false);

        expect((await rule.validate('videoOnly', vid, undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('videoOnly', aud, undefined, {} as any)).valid).toBe(false);

        expect((await rule.validate('audioOnly', aud, undefined, {} as any)).valid).toBe(true);
        expect((await rule.validate('audioOnly', img, undefined, {} as any)).valid).toBe(false);
    });
});
