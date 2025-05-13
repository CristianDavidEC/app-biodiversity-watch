import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MapObservationProps {
    latitude: number;
    longitude: number;
}

export default function MapObservation({ latitude, longitude }: MapObservationProps) {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                scrollEnabled={true}
                zoomEnabled={true}
            >
                <Marker coordinate={{ latitude, longitude }}>
                    <FontAwesome6 name="map-location-dot" size={32} color="#4E9889" />
                </Marker>
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 320,
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 12,
    },
    map: {
        flex: 1,
    },
});
