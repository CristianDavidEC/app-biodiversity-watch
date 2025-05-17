import { LocationIcon } from '@/components/common/icons';
import CardObservation from '@/components/observations/CardObservation';
import ObservationsFilters from '@/components/observations/ObservationsFilters';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const galeryData = [
    {
      id: '1',
      image: '../../assets/images/profile.png',
      description: 'Abeja comun',
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

  const handleMapPress = () => {
    console.log('Navegando a la vista de mapa...');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={galeryData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CardObservation {...item} />}
        numColumns={1}
        ListHeaderComponent={() => (
          <ObservationsFilters />
        )}
      />

      <TouchableOpacity
        onPress={handleMapPress}
        activeOpacity={0.8}
        className='bg-emerald-600 absolute bottom-10 right-10 w-16 h-16 rounded-full flex items-center justify-center'
      >
        <LocationIcon size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  }
});