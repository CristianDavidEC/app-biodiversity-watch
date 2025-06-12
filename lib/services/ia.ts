const IA_API_URL = process.env.IA_API_URL || "https://ia-model-production.up.railway.app";

interface IAResponse {
    especie: string;
    indice: number;
    probabilidades: number[][];
}

export const analyzeImagesWithIA = async (imageUris: string[]): Promise<IAResponse> => {
    const formData = new FormData();

    // Agregar todas las imágenes al formData
    imageUris.forEach((uri, index) => {
        formData.append('file', {
            uri,
            name: `image_${index}.jpg`,
            type: 'image/jpeg',
        } as any);
    });

    const response = await fetch(`${IA_API_URL}/predict`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta de IA:', errorText);
        throw new Error('Error al analizar las imágenes con IA');
    }

    return await response.json();
}; 