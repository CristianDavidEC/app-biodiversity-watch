import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { analyzeImagesWithIA } from '../lib/services/ia';
import { createObservation, CreateObservationData } from '../lib/services/observations';
import { supabase } from '../lib/supabase';

// Definición del tipo de parámetros de la ruta
type RootStackParamList = {
    ObservationForm: { imageUris: string[] };
};

type ObservationState = 'vivo' | 'muerto' | 'cautiverio' | 'herido' | 'enfermo';

interface IAResponse {
    especie: string;
    indice: number;
    probabilidades: number[][];
}

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
    const [iaResult, setIaResult] = useState<IAResponse | null>(null);
    const [analyzingImages, setAnalyzingImages] = useState(false);
    const [error, setError] = useState('');

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
            setAnalyzingImages(true);

            // Analizar todas las imágenes con IA (devuelve un solo objeto)
            const result = await analyzeImagesWithIA(imageUris);
            setIaResult(result);
            setAnalyzingImages(false);

            // Subir las imágenes al bucket
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
            Alert.alert('Éxito', 'Las imágenes se han analizado y cargado correctamente');
        } catch (error: any) {
            console.error('Error al procesar las imágenes:', error);
            Alert.alert('Error', 'No se pudieron procesar las imágenes. Por favor, inténtalo de nuevo.');
            setImagesValidated(false);
            setValidatedImageUrls([]);
            setIaResult(null);
        } finally {
            setUploadingImages(false);
            setAnalyzingImages(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');

            // Validar campos requeridos
            if (!date || !latitude || !longitude || !selectedState || !notes) {
                setError('Por favor complete todos los campos requeridos');
                return;
            }

            // Preparar datos de la observación
            const observationData: CreateObservationData = {
                date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                note: notes,
                state: selectedState,
                type_observation: 'avistamiento',
                verification_status: false,
                id_observer_user: (await supabase.auth.getUser()).data.user?.id || '',
                images: validatedImageUrls,
                ...(iaResult && {
                    similarity_percentage: iaResult.probabilidades[0][iaResult.indice] * 100,
                    specie_scientific_name: iaResult.especie.replace(/_/g, ' '),
                })
            };

            // Crear la observación
            await createObservation(observationData);

            // Limpiar el formulario
            setDate(new Date());
            setLatitude('');
            setLongitude('');
            setNotes('');
            setSelectedState('vivo');
            setImagesValidated(false);
            setValidatedImageUrls([]);
            setIaResult(null);

            // Mostrar mensaje de éxito
            Alert.alert('Éxito', 'Observación creada correctamente');

            // Navegar de vuelta a la pantalla anterior
            navigation.goBack();
        } catch (error: any) {
            console.error('Error al crear la observación:', error);
            setError('Error al crear la observación. Por favor intente nuevamente.');
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
                        {analyzingImages ? 'Analizando imágenes con IA...' :
                            uploadingImages ? 'Subiendo imágenes...' :
                                imagesValidated ? 'Imágenes validadas ✓' :
                                    'Validar imágenes'}
                    </Text>
                </TouchableOpacity>
                {imagesValidated && iaResult && (
                    <View className="mt-2 p-3 bg-gray-800 rounded-lg">
                        <Text className="text-emerald-500 text-sm mt-2">
                            {validatedImageUrls.length} imagen(es) validada(s)
                        </Text>
                        <Text className="text-white font-bold">Resultado IA</Text>
                        <Text className="text-emerald-400">
                            Especie detectada: {iaResult.especie.replace(/_/g, ' ')}
                        </Text>
                        <Text className="text-emerald-400">
                            Probabilidad: {(iaResult.probabilidades[0][iaResult.indice] * 100).toFixed(2)}%
                        </Text>
                    </View>
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