import { API_URL } from '../config';
import { supabase } from '../supabase';

export interface CreateObservationData {
    date: string;
    latitude: number;
    longitude: number;
    note: string;
    state: string;
    type_observation: string;
    verification_status: boolean;
    id_observer_user: string;
    images: string[];
}

const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
};

export const createObservation = async (observationData: CreateObservationData) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${API_URL}/api/observations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(observationData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear la observación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al crear la observación:', error);
        throw error;
    }
}; 