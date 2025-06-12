import { API_URL } from '../config';
import { supabase } from '../supabase';
import { getSpeciesByScientificName } from './species';

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
    similarity_percentage?: number;
    specie_scientific_name?: string;
    specie_common_name?: string;
    id_specie?: string;
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

        // Si tenemos el nombre científico de la especie, buscamos su información
        if (observationData.specie_scientific_name) {
            try {
                const speciesResponse = await getSpeciesByScientificName(observationData.specie_scientific_name);
                if (speciesResponse.success && speciesResponse.data) {
                    observationData.id_specie = speciesResponse.data.id_specie;
                    observationData.specie_common_name = speciesResponse.data.common_name;
                }
            } catch (error) {
                console.warn('No se pudo obtener la información de la especie:', error);
                // Continuamos con la creación de la observación incluso si no se encuentra la especie
            }
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

export const getObservationsByUser = async (userId: string, page = 1) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        const response = await fetch(`${API_URL}/api/observations/user/${userId}?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las observaciones');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las observaciones:', error);
        throw error;
    }
};

export const getAllObservations = async (page = 1) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        const response = await fetch(`${API_URL}/api/observations?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las observaciones');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener todas las observaciones:', error);
        throw error;
    }
};

export const getObservationById = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        const response = await fetch(`${API_URL}/api/observations/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener la observación');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener la observación:', error);
        throw error;
    }
}; 