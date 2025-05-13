import { CameraIcon } from "@/components/common/icons";
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from '@react-navigation/stack';
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type RootStackParamList = {
  Camera: undefined;
  ObservationForm: { imageUris: string[] };
};

export default function CameraScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [images, setImages] = useState<string[]>([]);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  // Limpiar imágenes y referencia de cámara al salir del tab
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setImages([]);
        if (cameraRef.current) cameraRef.current = null;
      };
    }, [])
  );

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...uris]);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) setImages(prev => [...prev, photo.uri]);
    }
  };

  const goToForm = () => {
    if (images.length > 0) {
      navigation.navigate("ObservationForm", { imageUris: images });
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text>Solicitando permisos de cámara...</Text></View>;
  }
  if (!permission.granted) {
    return <View style={styles.container}><Text>No se ha concedido acceso a la cámara.</Text><Button title="Conceder permiso" onPress={requestPermission} /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toma o selecciona una o varias fotos</Text>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="picture"
        />
        <TouchableOpacity style={styles.galleryButton} onPress={pickImages}>
          <FontAwesome name="image" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.captureButtonOverlay} onPress={takePhoto}>
        <CameraIcon color="white" size={48} />
      </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', paddingTop: 30 },
  title: { fontSize: 22, marginBottom: 10, color: 'white', alignSelf: 'flex-start', marginLeft: 10 },
  cameraContainer: { flex: 1, width: '100%', borderRadius: 16, overflow: 'hidden', position: 'relative', backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  galleryButton: { position: 'absolute', left: 20, bottom: 30, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 30, padding: 10, zIndex: 2 },
  captureButtonOverlay: { position: 'absolute', alignSelf: 'center', bottom: 20, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 40, padding: 16, zIndex: 1 },
  imagePreview: { width: 100, height: 100, borderRadius: 10, marginRight: 10 },
});
