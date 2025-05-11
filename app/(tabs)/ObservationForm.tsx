import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// Definición del tipo de parámetros de la ruta
type RootStackParamList = {
    ObservationForm: { imageUris: string[] };
};

export default function ObservationForm() {
    const route = useRoute<RouteProp<RootStackParamList, 'ObservationForm'>>();
    const navigation = useNavigation();
    const { imageUris } = route.params;
    const [notes, setNotes] = useState("");

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Creación de Observación</Text>
            <View style={styles.imagesRow}>
                {imageUris.map((uri, idx) => (
                    <Image key={idx} source={{ uri }} style={styles.image} />
                ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Notas respecto a la observación realizada</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe tus notas aquí..."
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
    label: { fontSize: 16, marginBottom: 8 },
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
}); 