import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createObservation, CreateObservationData } from '../lib/services/observations';
import { supabase } from '../lib/supabase';

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
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const [selectedState, setSelectedState] = useState<ObservationState>('vivo');
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [validatedImageUrls, setValidatedImageUrls] = useState<string[]>([]);
    const [imagesValidated, setImagesValidated] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setLatitude(location.coords.latitude.toString());
            setLongitude(location.coords.longitude.toString());
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

    const uploadImages = async () => {
        try {
            setUploadingImages(true);
            const uploadedUrls: string[] = [];

            for (const uri of imageUris) {
                if (!uri.startsWith('file://') && !uri.startsWith('content://')) {
                    throw new Error('URI de imagen inválida');
                }

                const filename = uri.split('/').pop();
                const fileExt = filename?.split('.').pop() || 'jpg';
                const filePath = `observations/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

                const formData = new FormData();
                formData.append('file', {
                    uri,
                    name: filename,
                    type: `image/${fileExt}`,
                } as any);

                const { data, error: uploadError } = await supabase.storage
                    .from('biodiversity-files')
                    .upload(filePath, formData, {
                        contentType: `image/${fileExt}`,
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    throw uploadError;
                }

                uploadedUrls.push(filePath);
            }

            setValidatedImageUrls(uploadedUrls);
            setImagesValidated(true);
            Alert.alert('Éxito', 'Las imágenes se han cargado correctamente');
        } catch (error: any) {
            console.error('Error al subir las imágenes:', error);
            Alert.alert('Error', 'No se pudieron subir las imágenes. Por favor, inténtalo de nuevo.');
            setImagesValidated(false);
            setValidatedImageUrls([]);
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!imagesValidated) {
                Alert.alert('Error', 'Debes validar las imágenes antes de crear la observación');
                return;
            }

            if (validatedImageUrls.length === 0) {
                Alert.alert('Error', 'No hay imágenes validadas para la observación');
                return;
            }

            setLoading(true);

            // Validar latitud y longitud
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            if (isNaN(lat) || isNaN(lng)) {
                Alert.alert('Error', 'Debes ingresar una latitud y longitud válidas');
                setLoading(false);
                return;
            }

            const observationData: CreateObservationData = {
                date: date.toISOString().split('T')[0],
                latitude: lat,
                longitude: lng,
                note: notes,
                state: selectedState,
                type_observation: 'avistamiento',
                verification_status: false,
                id_observer_user: (await supabase.auth.getUser()).data.user?.id || '',
                images: validatedImageUrls
            };

            await createObservation(observationData);

            Alert.alert(
                'Éxito',
                'Observación creada correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error: any) {
            console.error('Error al crear la observación:', error);
            Alert.alert(
                'Error',
                error.message || 'No se pudo crear la observación. Por favor, inténtalo de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-black p-4" contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="w-full mb-6">
                <Text className="text-gray-300 text-base mb-2 font-bold">Imágenes</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                    <View className="flex-row gap-2">
                        {imageUris.map((uri, index) => (
                            <Image
                                key={index}
                                source={{ uri }}
                                className="w-28 h-28 rounded-lg mr-2"
                            />
                        ))}
                    </View>
                </ScrollView>
                <TouchableOpacity
                    className={`w-full py-3 rounded-lg ${uploadingImages ? 'bg-gray-500' : 'bg-[#0E9F6E]'}`}
                    onPress={uploadImages}
                    disabled={uploadingImages || imagesValidated}
                >
                    <Text className="text-white text-center font-bold">
                        {uploadingImages ? 'Subiendo imágenes...' :
                            imagesValidated ? 'Imágenes validadas ✓' :
                                'Validar imágenes'}
                    </Text>
                </TouchableOpacity>
                {imagesValidated && (
                    <Text className="text-emerald-500 text-sm mt-2">
                        {validatedImageUrls.length} imagen(es) validada(s)
                    </Text>
                )}
            </View>

            <View className="w-full mb-6">
                <Text className="text-gray-300 text-base mb-2 font-bold">Fecha y Hora de Captura</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text className="bg-gray-900 text-white px-4 py-3 rounded-lg text-lg">
                        {formatDateTime(date)}
                    </Text>
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

            <View className="w-full mb-6">
                <Text className="text-gray-300 text-base mb-2 font-bold">Ubicación</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 mr-2"
                        placeholder="Latitud"
                        placeholderTextColor="#9CA3AF"
                        value={latitude}
                        onChangeText={setLatitude}
                        editable={!location}
                        keyboardType="numeric"
                    />
                    <TextInput
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100"
                        placeholder="Longitud"
                        placeholderTextColor="#9CA3AF"
                        value={longitude}
                        onChangeText={setLongitude}
                        editable={!location}
                        keyboardType="numeric"
                    />
                </View>
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

            <TouchableOpacity
                className={`w-full py-3 rounded-lg ${loading ? 'bg-gray-500' : 'bg-[#0E9F6E]'} ${!imagesValidated ? 'opacity-50' : ''}`}
                onPress={handleSubmit}
                disabled={loading || !imagesValidated}
                style={{ marginBottom: 30 }}
            >
                <Text className="text-white text-center font-bold">
                    {loading ? 'Creando observación...' : 'Crear Observación'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
} 