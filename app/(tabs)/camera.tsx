import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";

type RootStackParamList = {
  Camera: undefined;
  ObservationForm: { imageUris: string[] };
};

export default function CameraScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [images, setImages] = useState<string[]>([]);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled) {
      // assets puede ser un array de imágenes
      const uris = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...uris]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const goToForm = () => {
    if (images.length > 0) {
      navigation.navigate("ObservationForm", { imageUris: images });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toma o selecciona una o varias fotos</Text>
      <View style={styles.buttonContainer}>
        <Button title="Seleccionar de galería" onPress={pickImages} />
        <Button title="Tomar foto" onPress={takePhoto} />
      </View>
      <ScrollView horizontal style={{ maxHeight: 120, marginBottom: 20 }}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.imagePreview} />
        ))}
      </ScrollView>
      <Button title="Continuar" onPress={goToForm} disabled={images.length === 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  buttonContainer: { flexDirection: "row", gap: 20, marginBottom: 20 },
  imagePreview: { width: 100, height: 100, borderRadius: 10, marginRight: 10 },
});
