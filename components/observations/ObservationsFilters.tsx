import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const ObservationsFilters = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [location, setLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // Aquí se procesarían los filtros
        console.log('Buscando con los siguientes filtros:');
        console.log('Búsqueda:', searchQuery);
        console.log('Nombre:', name);
        console.log('Fecha:', date.toDateString());
        console.log('Ubicación:', location);

        // Normalmente aquí se enviarían los datos a una API o se actualizaría el estado global
        Alert.alert(
            "Búsqueda realizada",
            `Búsqueda: ${searchQuery}\nNombre: ${name}\nFecha: ${date.toDateString()}\nUbicación: ${location}`
        );
    };

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.searchBarContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Ionicons
                            name={showFilters ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="white"
                        />
                        <Text style={styles.filterButtonText}>Filtros</Text>
                    </TouchableOpacity>
                </View>

                {showFilters && (
                    <View style={styles.filtersContainer}>
                        <View style={styles.filterItem}>
                            <Text style={styles.filterLabel}>Nombre</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Filtrar por nombre"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View style={styles.filterItem}>
                            <Text style={styles.filterLabel}>Fecha</Text>
                            <TouchableOpacity
                                style={styles.inputContainer}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Ionicons name="calendar" size={20} color="#888" style={styles.inputIcon} />
                                <Text style={styles.dateText}>{date.toDateString()}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>

                        <View style={styles.filterItem}>
                            <Text style={styles.filterLabel}>Ubicación</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="location" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Filtrar por ubicación"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleSearch}
                        >
                            <Ionicons name="search" size={18} color="white" style={styles.searchButtonIcon} />
                            <Text style={styles.searchButtonText}>Buscar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 16,
        marginVertical: 10
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden'
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    searchIcon: {
        marginRight: 8
    },
    searchInput: {
        flex: 1,
        height: 46,
        padding: 8
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3498db',
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    filterButtonText: {
        color: 'white',
        marginLeft: 4,
        fontWeight: '500'
    },
    filtersContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#00000',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    filterItem: {
        marginBottom: 16
    },
    filterLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: 46
    },
    inputIcon: {
        marginRight: 8
    },
    input: {
        flex: 1,
        height: '100%'
    },
    dateText: {
        flex: 1,
        color: '#333',
        fontSize: 16
    },
    searchButton: {
        flexDirection: 'row',
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginTop: 8
    },
    searchButtonIcon: {
        marginRight: 8
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '600'
    }
});

export default ObservationsFilters;