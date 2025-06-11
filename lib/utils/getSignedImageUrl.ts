import { supabase } from '../supabase';

export const getSignedImageUrl = async (path: string, expiresInSeconds: number = 3600): Promise<string | null> => {
    if (!path) return null;
    const { data, error } = await supabase.storage
        .from('biodiversity-files')
        .createSignedUrl(path, expiresInSeconds);
    if (error) {
        console.error('Error al generar URL prefirmada:', error);
        return null;
    }
    return data?.signedUrl || null;
}; 