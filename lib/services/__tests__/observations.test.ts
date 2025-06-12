import { createObservation } from '../observations';

jest.mock('../../supabase', () => ({
    supabase: {
        auth: {
            getSession: jest.fn(async () => ({ data: { session: { access_token: 'fake-token' } } })),
        },
    },
}));

global.fetch = jest.fn(async (url, options) => {
    if (url.includes('/api/observations')) {
        return {
            ok: true,
            json: async () => ({ success: true, id: '123' }),
        };
    }
    return { ok: false, json: async () => ({ message: 'Error' }) };
});

describe('createObservation', () => {
    it('crea una observación correctamente', async () => {
        const data = {
            date: '2024-06-01',
            latitude: 10.1,
            longitude: -84.1,
            note: 'Test',
            state: 'Nueva',
            type_observation: 'Visual',
            verification_status: false,
            id_observer_user: 'user1',
            images: [],
        };
        const result = await createObservation(data);
        expect(result).toEqual({ success: true, id: '123' });
    });
}); 