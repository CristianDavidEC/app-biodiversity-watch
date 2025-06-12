import { getSpeciesByScientificName } from '../species';

jest.mock('../../supabase', () => ({
    supabase: {
        auth: {
            getSession: jest.fn(async () => ({ data: { session: { access_token: 'fake-token' } } })),
        },
    },
}));

global.fetch = jest.fn(async (url, options) => {
    if (url.includes('/api/species/scientific-name')) {
        return {
            ok: true,
            json: async () => ({ success: true, data: { id_specie: '1', common_name: 'Jaguar' } }),
        };
    }
    return { ok: false, json: async () => ({ message: 'Error' }) };
});

describe('getSpeciesByScientificName', () => {
    it('devuelve la especie correctamente', async () => {
        const result = await getSpeciesByScientificName('Panthera onca');
        expect(result).toEqual({ success: true, data: { id_specie: '1', common_name: 'Jaguar' } });
    });
}); 