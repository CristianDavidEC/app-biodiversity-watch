import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getSignedImageUrl } from '../../lib/utils/getSignedImageUrl';

const { height } = Dimensions.get('window');
const PLACEHOLDER_IMAGE = require('../../assets/images/profile.png');

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
    images?: string[];
}

interface MapViewProps {
    observations: Observation[];
}

function ObservationImage({ image, images }: { image: string; images?: string[] }) {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchUrl = async () => {
            setLoading(true);
            let url = '';
            if (images && images.length > 0) {
                url = await getSignedImageUrl(images[0]);
            } else if (image) {
                url = image;
            }
            if (isMounted) setSignedUrl(url);
            setLoading(false);
        };
        fetchUrl();
        return () => { isMounted = false; };
    }, [image, images]);

    if (loading) {
        return (
            <View style={[styles.observationImage, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="small" color="#0E9F6E" />
            </View>
        );
    }
    return (
        <Image
            source={signedUrl ? { uri: signedUrl } : PLACEHOLDER_IMAGE}
            style={styles.observationImage}
        />
    );
}

function groupObservationsByProximity(observations: Observation[], radiusMeters = 50) {
    const groups: Observation[][] = [];
    const toRadians = (deg: number) => deg * (Math.PI / 180);
    function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371000;
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    observations.forEach((obs) => {
        let foundGroup = null;
        for (const group of groups) {
            const ref = group[0];
            if (
                distance(
                    obs.coordinate.latitude,
                    obs.coordinate.longitude,
                    ref.coordinate.latitude,
                    ref.coordinate.longitude
                ) < radiusMeters
            ) {
                foundGroup = group;
                break;
            }
        }
        if (foundGroup) {
            foundGroup.push(obs);
        } else {
            groups.push([obs]);
        }
    });
    return groups;
}

export default function ObservationsMap({ observations }: MapViewProps) {
    const router = useRouter();
    const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Observation[] | null>(null);

    const handleMarkerPress = (group: Observation[]) => {
        setSelectedObservation(group[0]);
        setSelectedGroup(group);
    };

    const handleObservationPress = (observationId: string) => {
        router.push(`/observations/${observationId}`);
    };

    // Agrupar observaciones por proximidad (50 metros)
    const grouped = groupObservationsByProximity(observations, 50);

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
                {grouped.map((group, idx) => {
                    // Usar el primer elemento como referencia para el marcador
                    const firstObservation = group[0];
                    return (
                        <Marker
                            key={idx}
                            coordinate={firstObservation.coordinate}
                            title={`${group.length} observaciones`}
                            onPress={() => handleMarkerPress(group)}
                        >
                            <View style={styles.markerContainer}>
                                <Ionicons name="location" size={30} color="#27AE60" />
                                {group.length > 1 && (
                                    <View style={styles.markerBadge}>
                                        <Text style={styles.markerBadgeText}>{group.length}</Text>
                                    </View>
                                )}
                            </View>
                        </Marker>
                    );
                })}
            </MapView>

            {selectedObservation && selectedGroup && (
                <View style={styles.infoContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        {selectedGroup.map((observation) => (
                            <TouchableOpacity
                                key={observation.id}
                                style={styles.observationItem}
                                onPress={() => handleObservationPress(observation.id)}
                            >
                                <View style={styles.observationContent}>
                                    <View style={styles.observationTextContainer}>
                                        <Text style={styles.observationTitle}>{observation.description}</Text>
                                        <Text className={"text-xs text-gray-400"}>{observation.date}</Text>
                                        <Text style={styles.observationLocation}>{observation.location}</Text>
                                    </View>
                                    <ObservationImage image={observation.image} images={observation.images} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => { setSelectedObservation(null); setSelectedGroup(null); }}
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
        maxHeight: 180,
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