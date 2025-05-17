import { LocationIcon } from '@/components/common/icons';
import CardObservation from '@/components/observations/CardObservation';
import ObservationsFilters from '@/components/observations/ObservationsFilters';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface Observation {
  id: string;
  title: string;
  date: string;
}

interface CardinalPoint {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  observations: Observation[];
}

// Datos de ejemplo para los puntos cardinales
const cardinalPoints: CardinalPoint[] = [
  {
    id: '1',
    name: 'Parque Nacional Natural Tayrona',
    coordinate: {
      latitude: 11.3114,
      longitude: -74.0772
    },
    observations: [
      { id: '1', title: 'Abeja común', date: '24 Sep 2023' },
      { id: '2', title: 'Oso Pardo de Anteojos', date: '24 Sep 2023' }
    ]
  },
  {
    id: '2',
    name: 'Parque Natural Nacional de los Nevados',
    coordinate: {
      latitude: 4.8333,
      longitude: -75.3667
    },
    observations: [
      { id: '3', title: 'Ballenato de la Sierra Nevada', date: '24 Sep 2023' },
      { id: '4', title: 'Frailejon del Ruiz', date: '24 Sep 2023' },
      { id: '5', title: 'Lobo de los Andes', date: '24 Sep 2023' },
      { id: '6', title: 'Pasto de Frailejon', date: '24 Sep 2023' },
      { id: '7', title: 'Escarabajo de los Andes', date: '24 Sep 2023' }
    ]
  },
  {
    id: '3',
    name: 'Parque Natural Nacional Sierra Nevada de Santa Marta',
    coordinate: {
      latitude: 10.8333,
      longitude: -73.6667
    },
    observations: []
  }
];

// Datos de ejemplo para las cards
const galeryData = [
  {
    id: '1',
    image: '../../assets/images/profile.png',
    description: 'Abeja común',
    date: '24 Sep 2023',
    location: 'Parque Nacional Natural Tayrona'
  },
  {
    id: '2',
    image: '../../assets/images/profile.png',
    description: 'Oso Pardo de Anteojos',
    date: '24 Sep 2023',
    location: 'Parque Nacional Natural Tayrona'
  },
  {
    id: '3',
    image: '../../assets/images/profile.png',
    description: 'Ballenato de la Sierra Nevada',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional de los Nevados'
  },
  {
    id: '4',
    image: '../../assets/images/profile.png',
    description: 'Frailejon del Ruiz',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional Sierra Nevada de Santa Marta'
  },
  {
    id: '5',
    image: '../../assets/images/profile.png',
    description: 'Lobo de los Andes',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional de los Nevados'
  },
  {
    id: '6',
    image: '../../assets/images/profile.png',
    description: 'Pasto de Frailejon',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional de los Nevados'
  },
  {
    id: '7',
    image: '../../assets/images/profile.png',
    description: 'Escarabajo de los Andes',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional de los Nevados'
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedPoint, setSelectedPoint] = useState<CardinalPoint | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleMarkerPress = (point: CardinalPoint) => {
    setSelectedPoint(point);
  };

  const handleObservationPress = (observationId: string) => {
    router.push(`/observations/${observationId}`);
  };

  const toggleView = () => {
    setShowMap(!showMap);
    setSelectedPoint(null);
  };

  return (
    <View style={styles.container}>
      <ObservationsFilters />

      {showMap ? (
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
          {cardinalPoints.map((point) => (
            <Marker
              key={point.id}
              coordinate={point.coordinate}
              title={point.name}
              onPress={() => handleMarkerPress(point)}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={30} color="#27AE60" />
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <FlatList
          data={galeryData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardObservation {...item} />}
          numColumns={1}
        />
      )}

      {selectedPoint && (
        <View style={styles.infoContainer}>
          <Text style={styles.locationName}>{selectedPoint.name}</Text>
          {selectedPoint.observations.length > 0 ? (
            selectedPoint.observations.map((observation) => (
              <TouchableOpacity
                key={observation.id}
                style={styles.observationItem}
                onPress={() => handleObservationPress(observation.id)}
              >
                <Text style={styles.observationTitle}>{observation.title}</Text>
                <Text style={styles.observationDate}>{observation.date}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noObservations}>No hay observaciones en este punto</Text>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPoint(null)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={toggleView}
        activeOpacity={0.8}
        className='bg-emerald-600 absolute bottom-5 right-5 w-16 h-16 rounded-full flex items-center justify-center'
      >
        {showMap ? (
          <Ionicons name="list" size={24} color="#fff" />
        ) : (
          <LocationIcon size={24} color="#fff" />
        )}
      </TouchableOpacity>
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
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.4,
  },
  locationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  observationItem: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  observationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  observationDate: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  noObservations: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});