import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from "react-native";
import MapObservation from './MapObservation';

export type RootStackParamList = {
    // ...otras rutas
    'observations/SpeciesDetails': { nombre: string; nombreCientifico: string };
};

interface DetailsObservationProps {
    observation: any;
}

const DetailsObservation = ({ observation }: DetailsObservationProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const renderProgressBar = (progress: any) => {
        return (
            <View className="items-center justify-center my-5">
                <View className="w-4/5 h-4 rounded-full bg-gray-300 overflow-hidden">
                    <View style={[{ width: `${progress}%` }]} className="h-full bg-emerald-500" />
                </View>
                <Text className="text-sm text-emerald-500 font-thin">{progress}% de simulitud</Text>
            </View>
        );
    };

    const handleGoToSpecies = () => {
        navigation.navigate('observations/SpeciesDetails', {
            nombre: observation.species_name || 'Nombre genérico',
            nombreCientifico: observation.scientific_name || 'Nombre científico genérico',
        });
    };

    return (
        <View className="mt-4 mx-2">
            <TouchableOpacity onPress={handleGoToSpecies}>
                <Text className="text-2xl text-emerald-500">
                    <FontAwesome name="paw" size={24} color="#0E9F6E" />{"  "}{observation.species_name || 'Nombre genérico'}</Text>
                <Text className="text-lg text-gray-300 font-thin italic">{observation.scientific_name || 'Nombre científico genérico'}</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-300 font-extralight mt-2">
                <FontAwesome5 name="clock" size={12} color="#0E9F6E" style={{ marginRight: 8 }} />
                {"  "}{observation.date || 'Sin fecha'}
            </Text>
            <Text className="text-sm text-gray-300 font-extralight">
                <FontAwesome5 name="map-marked-alt" size={12} color="#0E9F6E" />
                {"  "}Lat: {observation.latitude}, Lng: {observation.longitude}
            </Text>
            {/* Barra de progreso opcional */}
            {/* {renderProgressBar(70)} */}
            <Text className="text-base text-gray-300 font-thin mt-2 border-b border-gray-700 pb-2">
                <FontAwesome5 name="sticky-note" size={16} color="#0E9F6E" style={{ marginRight: 8 }} />{' '}
                {observation.note || 'Sin descripción'}
            </Text>
            <Text className="text-base text-gray-300 font-thin mt-2 border-b border-gray-700 pb-2">
                El oso de anteojos es un mamífero nativo de los Andes, conocido por su pelaje distintivo y su dieta variada.
                Se alimenta principalmente de frutas, hojas y pequeños animales. Es un animal solitario y nocturno, y su hábitat se encuentra en bosques montañosos.
                El oso de anteojos es considerado vulnerable debido a la pérdida de hábitat y la caza furtiva.
            </Text>
            <MapObservation latitude={observation.latitude} longitude={observation.longitude} />
        </View>
    );
}

export default DetailsObservation;