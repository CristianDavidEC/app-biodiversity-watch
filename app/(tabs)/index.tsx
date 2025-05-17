import { LocationIcon } from '@/components/common/icons';
import CardObservation from '@/components/observations/CardObservation';
import ObservationsMap from '@/components/observations/MapView';
import ObservationsFilters from '@/components/observations/ObservationsFilters';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';


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

// Datos de ejemplo para las observaciones
const galeryData: Observation[] = [
  {
    id: '1',
    image: '../../assets/images/profile.png',
    description: 'Abeja común',
    date: '24 Sep 2023',
    location: 'Parque Nacional Natural Tayrona',
    coordinate: {
      latitude: 11.3114,
      longitude: -75.0772
    }
  },
  {
    id: '2',
    image: '../../assets/images/profile.png',
    description: 'Oso Pardo de Anteojos',
    date: '24 Sep 2023',
    location: 'Parque Nacional Natural Tayrona',
    coordinate: {
      latitude: 11.3114,
      longitude: -75.0772
    }
  },
  {
    id: '3',
    image: '../../assets/images/profile.png',
    description: 'Ballenato de la Sierra Nevada',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional de los Nevados',
    coordinate: {
      latitude: 4.8333,
      longitude: -75.3667
    }
  },
  {
    id: '4',
    image: '../../assets/images/profile.png',
    description: 'Frailejon del Ruiz',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional Sierra Nevada de Santa Marta',
    coordinate: {
      latitude: 10.8333,
      longitude: -73.6667
    }
  },
  {
    id: '5',
    image: '../../assets/images/profile.png',
    description: 'Lobo de los Andes',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional de los Nevados',
    coordinate: {
      latitude: 4.8333,
      longitude: -75.3667
    }
  },
  {
    id: '6',
    image: '../../assets/images/profile.png',
    description: 'Pasto de Frailejon',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional de los Nevados',
    coordinate: {
      latitude: 4.8333,
      longitude: -75.3667
    }
  },
  {
    id: '7',
    image: '../../assets/images/profile.png',
    description: 'Escarabajo de los Andes',
    date: '24 Sep 2023',
    location: 'Parque Natural Nacional de los Nevados',
    coordinate: {
      latitude: 4.8333,
      longitude: -75.3667
    }
  }
];

export default function HomeScreen() {
  const [showMap, setShowMap] = useState(false);

  const toggleView = () => {
    setShowMap(!showMap);
  };

  return (
    <View style={styles.container}>
      <ObservationsFilters />

      {showMap ? (
        <ObservationsMap observations={galeryData} />
      ) : (
        <FlatList
          data={galeryData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardObservation {...item} />}
          numColumns={1}
        />
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
});