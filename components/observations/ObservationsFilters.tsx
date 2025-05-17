import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Alert,
    Keyboard,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const ObservationsFilters = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [location, setLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        const filters = {
            search: searchQuery,
            startDate: startDate?.toDateString() || 'No especificada',
            endDate: endDate?.toDateString() || 'No especificada',
            location: location || 'No especificada'
        };

        console.log('Buscando con filtros:', filters);
        Alert.alert(
            "Búsqueda realizada",
            `Búsqueda: ${searchQuery}\nFecha inicial: ${filters.startDate}\nFecha final: ${filters.endDate}\nUbicación: ${filters.location}`
        );
    };

    const onChangeStartDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(currentDate);
    };

    const onChangeEndDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(Platform.OS === 'ios');
        setEndDate(currentDate);
    };

    const clearStartDate = () => {
        setStartDate(null);
    };

    const clearEndDate = () => {
        setEndDate(null);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="px-5 py-4 rounded-lg shadow-md mx-4 my-3 mt-6">
                <View className="flex-row items-center gap-2">
                    <View className="flex-1 flex-row items-center border border-black rounded-lg overflow-hidden bg-gray-900">
                        <Ionicons name="search" size={20} color="#9CA3AF" className="ml-3" />
                        <TextInput
                            className="flex-1 h-12 px-3 text-gray-100 text-base"
                            placeholder="Buscar por nombre..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity
                        className="bg-emerald-600 w-12 h-12 items-center justify-center rounded-lg"
                        onPress={handleSearch}
                    >
                        <Ionicons name="search" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-emerald-600 w-12 h-12 items-center justify-center rounded-lg"
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Ionicons
                            name={showFilters ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                {showFilters && (
                    <View className="mt-4 p-4 bg-gray-960 rounded-lg border border-gray-800">
                        <View className="mb-4">
                            <Text className="text-sm text-gray-400 mb-1.5">Fecha Inicial</Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    className="flex-1 flex-row items-center bg-gray-900 border border-gray-800 rounded-md overflow-hidden px-2.5 h-11"
                                    onPress={() => setShowStartDatePicker(true)}
                                >
                                    <Ionicons name="calendar" size={20} color="#9CA3AF" className="mr-2" />
                                    <Text className="flex-1 text-gray-100 text-base">
                                        {startDate ? startDate.toDateString() : 'Seleccionar fecha'}
                                    </Text>
                                </TouchableOpacity>
                                {startDate && (
                                    <TouchableOpacity
                                        className="ml-2 bg-red-600 w-11 h-11 items-center justify-center rounded-md"
                                        onPress={clearStartDate}
                                    >
                                        <Ionicons name="close" size={24} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={startDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeStartDate}
                                />
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm text-gray-400 mb-1.5">Fecha Final</Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    className="flex-1 flex-row items-center bg-gray-900 border border-gray-800 rounded-md overflow-hidden px-2.5 h-11"
                                    onPress={() => setShowEndDatePicker(true)}
                                >
                                    <Ionicons name="calendar" size={20} color="#9CA3AF" className="mr-2" />
                                    <Text className="flex-1 text-gray-100 text-base">
                                        {endDate ? endDate.toDateString() : 'Seleccionar fecha'}
                                    </Text>
                                </TouchableOpacity>
                                {endDate && (
                                    <TouchableOpacity
                                        className="ml-2 bg-red-600 w-11 h-11 items-center justify-center rounded-md"
                                        onPress={clearEndDate}
                                    >
                                        <Ionicons name="close" size={24} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={endDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeEndDate}
                                />
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm text-gray-400 mb-1.5">Ubicación</Text>
                            <View className="flex-row items-center bg-gray-900 border border-gray-800 rounded-md overflow-hidden px-2.5 h-11">
                                <Ionicons name="location" size={20} color="#9CA3AF" className="mr-2" />
                                <TextInput
                                    className="flex-1 h-full text-gray-100"
                                    placeholder="Filtrar por ubicación"
                                    placeholderTextColor="#9CA3AF"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ObservationsFilters;