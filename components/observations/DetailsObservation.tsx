import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from "react-native";
import MapObservation from './MapObservation';

export type RootStackParamList = {
    // ...otras rutas
    'observations/SpeciesDetails': { id_specie: string };
};

interface DetailsObservationProps {
    observation: {
        specie_common_name?: string;
        specie_scientific_name?: string;
        similarity_percentage?: number;
        date?: string;
        created_at?: string;
        latitude?: number;
        longitude?: number;
        note?: string;
        id_specie?: string;
        type_observation?: string;
        state?: string;
    };
}

const DetailsObservation = ({ observation }: DetailsObservationProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderProgressBar = (progress: number) => {
        return (
            <View className="items-center justify-center my-5">
                <View className="w-4/5 h-4 rounded-full bg-gray-300 overflow-hidden">
                    <View style={[{ width: `${progress}%` }]} className="h-full bg-emerald-500" />
                </View>
                <Text className="text-sm text-emerald-500 font-thin mt-1">{progress.toFixed(2)}% de similitud</Text>
            </View>
        );
    };

    const handleGoToSpecies = () => {
        if (observation.id_specie) {
            navigation.navigate('observations/SpeciesDetails', {
                id_specie: observation.id_specie,
            });
        }
    };

    return (
        <View className="mt-4 mx-2">
            <TouchableOpacity onPress={handleGoToSpecies}>
                <Text className="text-2xl text-emerald-500">
                    <FontAwesome name="paw" size={24} color="#0E9F6E" />{"  "}{observation.specie_common_name}
                </Text>
                <Text className="text-lg text-gray-300 font-thin italic">{observation.specie_scientific_name}</Text>
            </TouchableOpacity>
            {typeof observation.similarity_percentage === 'number' && renderProgressBar(observation.similarity_percentage)}
            <Text className="text-sm text-gray-300 font-extralight mt-2">
                <FontAwesome5 name="clock" size={12} color="#0E9F6E" style={{ marginRight: 8 }} />
                {"  "}{formatDate(observation.created_at)}
            </Text>
            <Text className="text-sm text-gray-300 font-extralight">
                <FontAwesome5 name="map-marked-alt" size={12} color="#0E9F6E" />
                {"  "}Lat: {observation.latitude}, Lng: {observation.longitude}
            </Text>
            <Text className="text-sm text-gray-300 font-extralight">
                <FontAwesome5 name="tag" size={12} color="#0E9F6E" style={{ marginRight: 8 }} />
                {"  "}Tipo: {observation.type_observation || 'No especificado'}
            </Text>
            <Text className="text-sm text-gray-300 font-extralight">
                <FontAwesome5 name="info-circle" size={12} color="#0E9F6E" style={{ marginRight: 8 }} />
                {"  "}Estado: {observation.state || 'No especificado'}
            </Text>
            <Text className="text-base text-gray-300 font-thin mt-2 border-b border-gray-700 pb-2">
                <FontAwesome5 name="sticky-note" size={16} color="#0E9F6E" style={{ marginRight: 8 }} />{' '}
                {observation.note || 'Sin descripción'}
            </Text>
            {observation.latitude && observation.longitude && (
                <MapObservation
                    latitude={observation.latitude}
                    longitude={observation.longitude}
                />
            )}
        </View>
    );
}

export default DetailsObservation;