import { View, Text, StyleSheet } from "react-native";

const DetailsObservation = () => {
    const renderProgressBar = (progress: any) => {
        return (
            <View style={styles.container}>
                <View style={styles.barBackground}>
                    <View style={[styles.barFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.percentageText}>{progress}%</Text>
            </View>
        );
    };


    return (
        <View>
            <Text className="text-2xl text-white">Detalles de la observación</Text>
            {renderProgressBar(70)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    barBackground: {
        width: '80%',
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
    percentageText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DetailsObservation;