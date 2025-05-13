import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapObservation from './MapObservation';

export type RootStackParamList = {
    // ...otras rutas
    'observations/SpeciesDetails': { nombre: string; nombreCientifico: string };
};

const DetailsObservation = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const renderProgressBar = (progress: any) => {
        return (
            <View className="items-center justify-center my-3">
                <View className="w-4/5 h-4 rounded-full bg-gray-300 overflow-hidden">
                    <View style={[{ width: `${progress}%` }]} className="h-full bg-teal-700" />
                </View>
                <Text className="text-sm text-gray-300 font-thin">{progress}% de simulitud</Text>
            </View>
        );
    };

    const handleGoToSpecies = () => {
        navigation.navigate('observations/SpeciesDetails', {
            nombre: 'Oso de Anteojos',
            nombreCientifico: 'Tremarctos ornatus',
        });
    };

    return (
        <ScrollView className="mt-4 mx-2">
            <TouchableOpacity onPress={handleGoToSpecies}>
                <Text className="text-2xl text-white underline">Oso de Anteojos</Text>
                <Text className="text-lg text-gray-300 font-thin italic">Tremarctos ornatus</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-300 font-extralight">15-02-2023 10:00 AM</Text>
            <Text className="text-sm text-gray-300 font-extralight">El bosque Popular, Manizales</Text>
            {renderProgressBar(70)}
            <Text className="text-base text-gray-300 font-thin mt-2 border-b border-gray-700 pb-2">
                El oso de anteojos es un mamífero nativo de los Andes, conocido por su pelaje distintivo y su dieta variada.
                Se alimenta principalmente de frutas, hojas y pequeños animales. Es un animal solitario y nocturno, y su hábitat se encuentra en bosques montañosos.
                El oso de anteojos es considerado vulnerable debido a la pérdida de hábitat y la caza furtiva.
            </Text>
            <MapObservation latitude={5.0703} longitude={-75.5138} />
        </ScrollView>
    );
}

export default DetailsObservation;