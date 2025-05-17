import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Definición del tipo de parámetros de la ruta
type RootStackParamList = {
    ObservationForm: { imageUris: string[] };
};

type ObservationState = 'vivo' | 'muerto' | 'cautiverio' | 'herido' | 'enfermo';

export default function ObservationForm() {
    const route = useRoute<RouteProp<RootStackParamList, 'ObservationForm'>>();
    const navigation = useNavigation();
    const { imageUris } = route.params;

    const [notes, setNotes] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [manualLocation, setManualLocation] = useState("");
    const [selectedState, setSelectedState] = useState<ObservationState>('vivo');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const states: ObservationState[] = ['vivo', 'muerto', 'cautiverio', 'herido', 'enfermo'];

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setShowTimePicker(true);
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setDate(newDate);
        }
    };

    const formatDateTime = (date: Date) => {
        const pad = (n: number) => n < 10 ? '0' + n : n;
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 20 }}>
            <ScrollView horizontal className="mb-6 w-full">
                <View className="flex-row justify-center w-full">
                    {imageUris.map((uri, idx) => (
                        <Image key={idx} source={{ uri }} className="w-48 h-40 rounded-2xl mx-2" />
                    ))}
                </View>
            </ScrollView>

            <View className="w-full mb-5">
                <Text className="text-gray-300 text-base mb-2 font-bold">Fecha y Hora de Captura</Text>
                <TouchableOpacity
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mb-2"
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                >
                    <Text className="text-gray-100 text-base">{formatDateTime(date)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        display="default"
                        onChange={onTimeChange}
                    />
                )}
            </View>

            <View className="w-full mb-5">
                <Text className="text-gray-300 text-base mb-2 font-bold">Ubicación</Text>
                {location ? (
                    <Text className="text-gray-400 text-sm mb-2">
                        Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}
                    </Text>
                ) : (
                    <TextInput
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100"
                        placeholder="Ingresa la ubicación manualmente..."
                        placeholderTextColor="#9CA3AF"
                        value={manualLocation}
                        onChangeText={setManualLocation}
                    />
                )}
            </View>

            <View className="w-full mb-5">
                <Text className="text-gray-300 text-base mb-2 font-bold">Estado del Especimen</Text>
                <View className="flex-row flex-wrap gap-2 mt-2">
                    {states.map((state) => (
                        <TouchableOpacity
                            key={state}
                            className={`px-4 py-2 rounded-lg ${selectedState === state ? 'bg-[#bbf451]' : 'bg-[#0E9F6E]'} `}
                            onPress={() => setSelectedState(state)}
                        >
                            <Text className={`font-bold uppercase text-xs ${selectedState === state ? 'text-black' : 'text-white'}`}>{state}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="w-full mb-6">
                <Text className="text-gray-300 text-base mb-2 font-bold">Notas</Text>
                <TextInput
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 min-h-[80px]"
                    placeholder="Describe lo que observaste..."
                    placeholderTextColor="#9CA3AF"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                />
            </View>

            <View className="w-full flex-row justify-between gap-4 mt-2">
                <TouchableOpacity
                    className="flex-1 py-3 rounded-lg bg-emerald-600 items-center"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-semibold text-lg">GUARDAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 py-3 rounded-lg items-center" style={{ backgroundColor: '#ff6467' }}
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-semibold text-lg">CANCELAR</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
} 