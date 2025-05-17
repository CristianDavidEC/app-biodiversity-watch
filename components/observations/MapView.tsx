import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { height } = Dimensions.get('window');

interface Observation {
    id: string;
    image: string;
    description: string;
    date: string;
    location: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
}

interface MapViewProps {
    observations: Observation[];
}

export default function ObservationsMap({ observations }: MapViewProps) {
    const router = useRouter();
    const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);

    const handleMarkerPress = (observation: Observation) => {
        setSelectedObservation(observation);
    };

    const handleObservationPress = (observationId: string) => {
        router.push(`/observations/${observationId}`);
    };

    // Agrupar observaciones por ubicación
    const groupedObservations = observations.reduce((acc, observation) => {
        const key = `${observation.coordinate.latitude}-${observation.coordinate.longitude}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(observation);
        return acc;
    }, {} as Record<string, Observation[]>);

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: 4.5709,
                    longitude: -74.2973,
                    latitudeDelta: 10,
                    longitudeDelta: 10,
                }}
            >
                {Object.entries(groupedObservations).map(([key, observations]) => {
                    const firstObservation = observations[0];
                    return (
                        <Marker
                            key={key}
                            coordinate={firstObservation.coordinate}
                            title={`${observations.length} observaciones`}
                            onPress={() => handleMarkerPress(firstObservation)}
                        >
                            <View style={styles.markerContainer}>
                                <Ionicons name="location" size={30} color="#27AE60" />
                                {observations.length > 1 && (
                                    <View style={styles.markerBadge}>
                                        <Text style={styles.markerBadgeText}>{observations.length}</Text>
                                    </View>
                                )}
                            </View>
                        </Marker>
                    );
                })}
            </MapView>

            {selectedObservation && (
                <View style={styles.infoContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        {groupedObservations[`${selectedObservation.coordinate.latitude}-${selectedObservation.coordinate.longitude}`].map((observation) => (
                            <TouchableOpacity
                                key={observation.id}
                                style={styles.observationItem}
                                onPress={() => handleObservationPress(observation.id)}
                            >
                                <View style={styles.observationContent}>
                                    <View style={styles.observationTextContainer}>
                                        <Text style={styles.observationTitle}>{observation.description}</Text>
                                        <Text style={styles.observationDate}>{observation.date}</Text>
                                        <Text style={styles.observationLocation}>{observation.location}</Text>
                                    </View>
                                    <Image
                                        source={require('../../assets/images/profile.png')}
                                        style={styles.observationImage}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedObservation(null)}
                    >
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    markerBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#27AE60',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#121212',
    },
    markerBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 0.6,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 15,
        paddingBottom: 0,
    },
    observationItem: {
        backgroundColor: '#2A2A2A',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    observationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    observationTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    observationTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    observationDate: {
        color: '#666',
        fontSize: 14,
        marginBottom: 2,
    },
    observationLocation: {
        color: '#666',
        fontSize: 12,
    },
    observationImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    closeButton: {
        backgroundColor: '#27AE60',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        margin: 15,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 