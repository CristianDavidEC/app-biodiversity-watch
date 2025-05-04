import { Image, ScrollView, Text, View } from "react-native";

const DetailsObservation = () => {
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


    return (
        <ScrollView className="mt-4 mx-2">
            <Text className="text-2xl text-white">Oso de Anteojos</Text>
            <Text className="text-lg text-gray-300 font-thin italic">Tremarctos ornatus</Text>
            <Text className="text-sm text-gray-300 font-extralight">15-02-2023 10:00 AM</Text>
            <Text className="text-sm text-gray-300 font-extralight">El bosque Popular, Manizales</Text>
            {renderProgressBar(70)}
            <Text className="text-base text-gray-300 font-thin mt-2 border-b border-gray-700 pb-2">
                El oso de anteojos es un mamífero nativo de los Andes, conocido por su pelaje distintivo y su dieta variada.
                Se alimenta principalmente de frutas, hojas y pequeños animales. Es un animal solitario y nocturno, y su hábitat se encuentra en bosques montañosos.
                El oso de anteojos es considerado vulnerable debido a la pérdida de hábitat y la caza furtiva.
            </Text>
            <Image source={require('../../assets/images/mapa.jpg')} className="rounded-lg w-[95%] h-80 object-contain m-3" />
        </ScrollView>
    );
}

export default DetailsObservation;