import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

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
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Creación de Observación</Text>

            <View style={styles.imagesRow}>
                {imageUris.map((uri, idx) => (
                    <Image key={idx} source={{ uri }} style={styles.image} />
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Fecha de Captura</Text>
                <Button
                    title={date.toLocaleDateString()}
                    onPress={() => setShowDatePicker(true)}
                />
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Ubicación</Text>
                {location ? (
                    <Text style={styles.locationText}>
                        Lat: {location.coords.latitude.toFixed(6)},
                        Long: {location.coords.longitude.toFixed(6)}
                    </Text>
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa la ubicación manualmente..."
                        value={manualLocation}
                        onChangeText={setManualLocation}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Estado del Especimen</Text>
                <View style={styles.stateButtons}>
                    {states.map((state) => (
                        <Button
                            key={state}
                            title={state.charAt(0).toUpperCase() + state.slice(1)}
                            color={selectedState === state ? '#4CAF50' : '#2196F3'}
                            onPress={() => setSelectedState(state)}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Notas</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Describe lo que observaste..."
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                />
            </View>

            <View style={styles.buttonRow}>
                <Button title="Guardar" color="green" onPress={() => navigation.goBack()} />
                <Button title="Cancelar" color="red" onPress={() => navigation.goBack()} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, alignItems: "center", padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    imagesRow: { flexDirection: 'row', marginBottom: 20 },
    image: { width: 100, height: 80, borderRadius: 10, marginRight: 10 },
    section: { width: "100%", marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        textAlignVertical: "top",
        backgroundColor: "#f9f9f9",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 20,
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    stateButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
}); 