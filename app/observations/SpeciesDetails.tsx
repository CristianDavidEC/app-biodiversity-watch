import ImageCarousel from '@/components/observations/ImageCarousel';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

const images = [
    { uri: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Spectacled_Bear_Tremarctos_ornatus.jpg' },
    { uri: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Oso_de_anteojos.jpg' },
    { uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Spectacled_Bear_in_Parque_Nacional_Natural_El_Cocuy.jpg' },
];

export default function SpeciesDetails() {
    return (
        <ScrollView className="flex-1 bg-black px-2">
            <ImageCarousel images={images} />
            <View className="mt-4">
                <Text className="text-2xl text-white font-bold">Oso de Anteojos <Text className="text-base italic text-gray-300">(Tremarctos ornatus)</Text></Text>
                <View className="flex-row flex-wrap gap-2 mt-2 items-center">
                    <FontAwesome name="globe" size={18} color="#4E9889" />
                    <Text className="text-gray-300 text-base">Distribución: Andes de Sudamérica</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-1 items-center">
                    <FontAwesome name="tree" size={18} color="#4E9889" />
                    <Text className="text-gray-300 text-base">Hábitat: Bosques húmedos, páramos y selvas nubladas</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-1 items-center">
                    <FontAwesome name="arrows-v" size={18} color="#4E9889" />
                    <Text className="text-gray-300 text-base">Tamaño: 1.3-2 m, hasta 200 kg</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-1 items-center">
                    <FontAwesome name="leaf" size={18} color="#4E9889" />
                    <Text className="text-gray-300 text-base">Dieta: Omnívoro (frutas, plantas, pequeños animales)</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-1 items-center">
                    <FontAwesome name="balance-scale" size={18} color="#4E9889" />
                    <Text className="text-gray-300 text-base">Rol ecológico: Dispersor de semillas y regulador de poblaciones</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-1 items-center">
                    <FontAwesome name="star" size={18} color="#4E9889" />
                    <Text className="text-gray-300 text-base">Dato curioso: Es el único oso de Sudamérica y símbolo de conservación andina.</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-1 items-center">
                    <FontAwesome name="exclamation-circle" size={18} color="#4E9889" />
                    <Text className="text-gray-300 text-base">Estado: Vulnerable (UICN)</Text>
                </View>
                <View className="mt-4">
                    <Text className="text-white font-semibold mb-1">Descripción:</Text>
                    <Text className="text-gray-300 text-base">
                        El oso de anteojos es el único oso nativo de Sudamérica. Se reconoce por las manchas blancas alrededor de sus ojos, que parecen gafas. Habita en los Andes, desde Venezuela hasta Bolivia, y es fundamental para el equilibrio ecológico de los bosques andinos. Es un animal solitario, de hábitos mayormente nocturnos y excelente trepador. Su dieta es variada, aunque prefiere frutas y vegetación. Está amenazado por la pérdida de hábitat y la caza furtiva.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
} 