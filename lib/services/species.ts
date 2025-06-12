import { API_URL } from '../config';
import { supabase } from '../supabase';

export interface SpeciesResponse {
    data: {
        id_specie: string;
        scientific_name: string;
        common_name: string;
    };
    success: boolean;
}

export interface Species {
    id_specie: string;
    scientific_name: string;
    common_name: string;
    type: string;
    habitat: string;
    size: string;
    ecological_role: string;
    conservation_status: string;
    description: string;
    distribution: string;
    family: string;
    created_at: string;
    updated_at: string;
}

const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
};

export const getSpeciesById = async (id: string): Promise<Species> => {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${API_URL}/api/species/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener la especie');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener la especie:', error);
        throw error;
    }
};

export const getSpeciesByScientificName = async (scientificName: string): Promise<SpeciesResponse> => {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${API_URL}/api/species/scientific-name/${encodeURIComponent(scientificName)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener la especie');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener la especie:', error);
        throw error;
    }
}; 