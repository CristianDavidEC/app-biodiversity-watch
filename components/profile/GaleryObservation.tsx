import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { getObservationsByUser } from '../../lib/services/observations';
import { supabase } from '../../lib/supabase';
import ItemGalery from "./ItemGalery";

export default function GaleryObservation({ header }: any) {
    const [observations, setObservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 5;
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchObservations = async (reset = false) => {
        if (reset && refreshing) return;
        if (!reset && isLoadingMore) return;
        if (reset) {
            setRefreshing(true);
        } else if (!reset) {
            setIsLoadingMore(true);
        }
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('No se pudo obtener el usuario autenticado.');
                setRefreshing(false);
                setIsLoadingMore(false);
                return;
            }
            const currentPage = reset ? 1 : page;
            const response = await getObservationsByUser(user.id, currentPage);
            const data = response.data || [];
            if (reset) {
                setObservations(data);
                setPage(2);
            } else {
                const ids = new Set(observations.map((item: any) => item.id_observation || item.id));
                const filtered = data.filter((item: any) => !ids.has(item.id_observation || item.id));
                setObservations((prev: any[]) => [...prev, ...filtered]);
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

    const renderItem = ({ item }: any) => (
        <ItemGalery
            id={item.id_observation || item.id}
            image={item.images && item.images.length > 0 ? item.images[0] : ''}
            description={item.note || 'Sin descripción'}
            date={item.date || ''}
        />
    );

    if (loading && observations.length === 0) {
        return <ActivityIndicator size="large" color="#0E9F6E" style={{ marginTop: 40 }} />;
    }
    if (error) {
        return <View style={{ marginTop: 40 }}><Text style={{ color: 'red' }}>{error}</Text></View>;
    }

    return (
        <FlatList
            data={observations}
            keyExtractor={(item) => (item.id_observation || item.id).toString()}
            renderItem={renderItem}
            numColumns={2}
            ListHeaderComponent={header}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.15}
            ListFooterComponent={isLoadingMore ? <ActivityIndicator size="large" /> : null}
        />
    );
}