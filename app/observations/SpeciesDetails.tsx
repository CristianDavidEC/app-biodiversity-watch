import ImageCarousel from '@/components/observations/ImageCarousel';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

const images = [
    { uri: 'https://fastly.picsum.photos/id/767/300/200.jpg?hmac=TTc0t0lEJWrTHSWhos7VTReXgTKIk-OUc3fQA1w91sI' },
    { uri: 'https://fastly.picsum.photos/id/882/300/200.jpg?hmac=8GSRyxTZ_rDVbOY6lS_4IA21EvGACEpqyewI1KZXAh0' },
    { uri: 'https://fastly.picsum.photos/id/982/200/300.jpg?hmac=xTKU9lOLW4f1_EmdynREJoYXZ7jXQUnwUNcYa6Nf4WA' },
];

export default function SpeciesDetails() {
    return (
        <ScrollView className="flex-1 bg-black px-2">
            <ImageCarousel images={images} />
            <Text className="text-2xl text-white font-bold">Oso de Anteojos <Text className="text-base italic text-gray-300">(Tremarctos ornatus)</Text></Text>
            <View className="flex-row items-start mt-2">
                <FontAwesome name="globe" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Distribución:</Text> Andes de Sudamérica
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="tree" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Hábitat:</Text> Bosques húmedos, páramos y selvas nubladas
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="arrows-v" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Tamaño:</Text> 1.3-2 m, hasta 200 kg
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="leaf" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Dieta:</Text> Omnívoro (frutas, plantas, pequeños animales)
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="balance-scale" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Rol ecológico:</Text> Dispersor de semillas y regulador de poblaciones
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="star" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Dato curioso:</Text> Es el único oso de Sudamérica y símbolo de conservación andina.
                </Text>
            </View>
            <View className="flex-row items-start mt-1">
                <FontAwesome name="exclamation-circle" size={18} color="#0E9F6E" className="mt-1" />
                <Text className="flex-1 pl-2 text-gray-300 text-base">
                    <Text className="font-bold text-white">Estado:</Text> Vulnerable (UICN)
                </Text>
            </View>
            <View className="mt-4 flex-row items-start">
                <FontAwesome name="info-circle" size={18} color="#0E9F6E" className="mt-1" />
                <View className="flex-1 pl-2">
                    <Text className="text-white font-semibold mb-1">Descripción:</Text>
                    <Text className="text-gray-300 text-base">
                        El oso de anteojos es el único oso nativo de Sudamérica. Se reconoce por las manchas blancas alrededor de sus ojos, que parecen gafas. Habita en los Andes, desde Venezuela hasta Bolivia, y es fundamental para el equilibrio ecológico de los bosques andinos. Es un animal solitario, de hábitos mayormente nocturnos y excelente trepador. Su dieta es variada, aunque prefiere frutas y vegetación. Está amenazado por la pérdida de hábitat y la caza furtiva.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
} 