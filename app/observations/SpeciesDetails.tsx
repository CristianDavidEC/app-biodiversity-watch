import ImageCarousel from '@/components/observations/ImageCarousel';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { getSpeciesById, Species } from '../../lib/services/species';
import { supabase } from '../../lib/supabase';

const defaultImages = [
    { uri: 'https://fastly.picsum.photos/id/767/300/200.jpg?hmac=TTc0t0lEJWrTHSWhos7VTReXgTKIk-OUc3fQA1w91sI' },
    { uri: 'https://fastly.picsum.photos/id/882/300/200.jpg?hmac=8GSRyxTZ_rDVbOY6lS_4IA21EvGACEpqyewI1KZXAh0' },
    { uri: 'https://fastly.picsum.photos/id/982/200/300.jpg?hmac=xTKU9lOLW4f1_EmdynREJoYXZ7jXQUnwUNcYa6Nf4WA' },
];

export default function SpeciesDetails() {
    const { id_specie } = useLocalSearchParams();
    const [species, setSpecies] = useState<Species | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [images, setImages] = useState<{ uri: string }[]>(defaultImages);

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getSpeciesById(id_specie as string);
                setSpecies(data);

                // Buscar imágenes en el bucket público de supabase
                if (data?.scientific_name) {
                    const folder = `${data.scientific_name.replace(/ /g, '_')}`;
                    const { data: files, error: storageError } = await supabase.storage
                        .from('species-files-biodyversity')
                        .list(folder, { limit: 20 });

                    if (!storageError && files && files.length > 0) {
                        const urls = files
                            .filter(file => file.name.match(/\.(jpg|jpeg|png|webp)$/i))
                            .map(file => {
                                const { data: urlData } = supabase.storage
                                    .from('species-files-biodyversity')
                                    .getPublicUrl(`${folder}/${file.name}`);
                                return { uri: urlData.publicUrl };
                            });
                        if (urls.length > 0) {
                            setImages(urls);
                        } else {
                            setImages(defaultImages);
                        }
                    } else {
                        setImages(defaultImages);
                    }
                } else {
                    setImages(defaultImages);
                }
            } catch (err: any) {
                setError('Error al cargar la especie.');
                setImages(defaultImages);
            } finally {
                setLoading(false);
            }
        };
        if (id_specie) fetchSpecies();
    }, [id_specie]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0E9F6E" style={{ marginTop: 40 }} />;
    }
    if (error || !species) {
        return <View style={{ marginTop: 40 }}><Text style={{ color: 'red' }}>{error || 'No se encontró la especie.'}</Text></View>;
    }

    return (
        <ScrollView className="flex-1 bg-black px-2">
            <ImageCarousel images={images} />
            <Text className="text-2xl text-white font-bold">{species.common_name} <Text className="text-base italic text-gray-300">({species.scientific_name})</Text></Text>
            <View className="flex-row items-start mt-2">
                <FontAwesome name="globe" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Distribución:</Text> {species.distribution}
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="tree" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Hábitat:</Text> {species.habitat}
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="arrows-v" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Tamaño:</Text> {species.size}
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="balance-scale" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Rol ecológico:</Text> {species.ecological_role}
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="exclamation-circle" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Estado de conservación:</Text> {species.conservation_status}
                </Text>
            </View>
            <View className="mt-4 flex-row items-start">
                <FontAwesome name="info-circle" size={18} color="#0E9F6E" className="mt-1" />
                <View className="flex-1 pl-2">
                    <Text className="text-white font-semibold mb-1">Descripción:</Text>
                    <Text className="text-gray-300 text-base">
                        {species.description}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="star" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Familia:</Text> {species.family}
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="leaf" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Tipo:</Text> {species.type}
                </Text>
            </View>
        </ScrollView>
    );
} 