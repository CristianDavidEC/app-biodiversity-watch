import DetailsObservation from "@/components/observations/DetailsObservation";
import ImageCarousel from "@/components/observations/ImageCarousel";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { getObservationById } from '../../lib/services/observations';
import { getSignedImageUrl } from '../../lib/utils/getSignedImageUrl';

export default function ObservationDetail() {
    const { id } = useLocalSearchParams();
    const [observation, setObservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageUrls, setImageUrls] = useState<{ uri: string }[]>([]);

    useEffect(() => {
        const fetchObservation = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getObservationById(id as string);
                const obs = response.data;
                setObservation(obs);
                // Obtener URLs firmadas de todas las imágenes
                let urls: { uri: string }[] = [];
                if (obs.images && obs.images.length > 0) {
                    urls = await Promise.all(obs.images.map(async (img: string) => {
                        const url = await getSignedImageUrl(img);
                        return { uri: url || '' };
                    }));
                }
                setImageUrls(urls);
            } catch (err: any) {
                setError('Error al cargar la observación.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchObservation();
    }, [id]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0E9F6E" style={{ marginTop: 40 }} />;
    }
    if (error || !observation) {
        return <View style={{ marginTop: 40 }}><Text style={{ color: 'red' }}>{error || 'No se encontró la observación.'}</Text></View>;
    }

    return (
        <ScrollView className="flex-1 bg-black">
            <ImageCarousel images={imageUrls.length > 0 ? imageUrls : [{ uri: '' }]} />
            <DetailsObservation observation={observation} />
        </ScrollView>
    );
}