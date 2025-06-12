import { getSignedImageUrl } from '../getSignedImageUrl';

jest.mock('../../supabase', () => ({
    supabase: {
        storage: {
            from: jest.fn().mockReturnThis(),
            createSignedUrl: jest.fn(async (path, expiresInSeconds) => {
                if (!path) return { data: null, error: 'No path' };
                return { data: { signedUrl: `https://fakeurl.com/${path}` }, error: null };
            }),
        },
    },
}));

describe('getSignedImageUrl', () => {
    it('devuelve null si el path está vacío', async () => {
        const url = await getSignedImageUrl('');
        expect(url).toBeNull();
    });

    it('devuelve una URL firmada si el path es válido', async () => {
        const url = await getSignedImageUrl('imagen.jpg');
        expect(url).toBe('https://fakeurl.com/imagen.jpg');
    });
}); 