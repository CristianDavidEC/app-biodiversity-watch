import { LocationIcon } from '@/components/common/icons';
import CardObservation from '@/components/observations/CardObservation';
import ObservationsMap from '@/components/observations/MapView';
import ObservationsFilters from '@/components/observations/ObservationsFilters';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAllObservations } from '../../lib/services/observations';
import { getSignedImageUrl } from '../../lib/utils/getSignedImageUrl';

export default function HomeScreen() {
  const [showMap, setShowMap] = useState(false);
  const [observations, setObservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    location: ''
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 5;

  const fetchObservations = async (reset = false) => {
    if (reset && refreshing) return;
    if (!reset && isLoadingMore) return;
    if (reset) {
      setRefreshing(true);
    } else if (!reset) {
      setIsLoadingMore(true);
    }
    try {
      const currentPage = reset ? 1 : page;
      const specieCommonName = filters.search ? filters.search : undefined;
      const response = await getAllObservations(currentPage, specieCommonName);
      const data = response.data || [];
      const mapped = await Promise.all(data.map(async (obs: any) => {
        let imageUrl = '';
        if (obs.images && obs.images.length > 0) {
          imageUrl = (await getSignedImageUrl(obs.images[0])) || '';
        }
        return {
          id: obs.id_observation || obs.id,
          image: imageUrl,
          description: obs.note || 'Sin descripción',
          date: obs.date || '',
          location: '',
          coordinate: {
            latitude: obs.latitude,
            longitude: obs.longitude
          },
          specie_common_name: obs.specie_common_name || '',
          specie_scientific_name: obs.specie_scientific_name || ''
        };
      }));
      if (reset) {
        setObservations(mapped);
        setPage(2);
      } else {
        setObservations(prev => {
          const ids = new Set(prev.map(item => item.id));
          const filtered = mapped.filter(item => !ids.has(item.id));
          return [...prev, ...filtered];
        });
        setPage(prev => prev + 1);
      }
      setHasMore(data.length === PAGE_SIZE);
    } catch (err: any) {
      setError('Error al cargar las observaciones.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchObservations(true);
  }, []);

  const onRefresh = () => {
    fetchObservations(true);
  };

  const onEndReached = () => {
    if (!loading && !refreshing && !isLoadingMore && hasMore) {
      fetchObservations(false);
    }
  };

  const toggleView = () => {
    setShowMap(!showMap);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0E9F6E" style={{ marginTop: 40 }} />;
  }
  if (error) {
    return <View style={{ marginTop: 40 }}><Text style={{ color: 'red' }}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ObservationsFilters onFilterChange={(newFilters) => {
        setFilters(newFilters);
        fetchObservations(true);
      }} />

      {showMap ? (
        <ObservationsMap observations={observations} />
      ) : (
        <FlatList
          data={observations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardObservation {...item} />}
          numColumns={1}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMore ? <ActivityIndicator size="large" /> : null}
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
  },
});