import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert, // Para mostrar mensajes simples
    KeyboardAvoidingView, // Ayuda a que el teclado no tape los inputs
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = () => {
        // --- Validación básica ---
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
            return;
        }

        // --- Lógica de inicio de sesión ---
        // Aquí iría la lógica real:
        // 1. Validar el formato del email (opcional pero recomendado).
        // 2. Enviar 'email' y 'password' a tu API backend para autenticación.
        // 3. Manejar la respuesta:
        //    - Si es exitosa: guardar token de usuario, navegar a la pantalla principal, etc.
        //    - Si hay error: mostrar mensaje de error al usuario.

        console.log('Intentando iniciar sesión con:');
        console.log('Email:', email);
        console.log('Password:', password); // ¡Nunca mostrar la contraseña en producción real!

        // Ejemplo de simulación de éxito (reemplazar con lógica real)
        Alert.alert('Éxito (Simulado)', '¡Inicio de sesión correcto!');
        // Aquí podrías navegar a otra pantalla, por ejemplo:
        // if (navigation) {
        //   navigation.navigate('Home'); // Asumiendo que tienes una pantalla 'Home'
        // }

        // Ejemplo de simulación de error (reemplazar con lógica real)
        // Alert.alert('Error de Autenticación', 'Correo o contraseña incorrectos.');
    };

    return (
        // KeyboardAvoidingView ayuda a que los inputs suban cuando aparece el teclado
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajuste según plataforma
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Iniciar Sesión</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#888" // Color del texto del placeholder
                    value={email}
                    onChangeText={setEmail} // Actualiza el estado 'email'
                    keyboardType="email-address" // Muestra teclado optimizado para email
                    autoCapitalize="none" // Evita la capitalización automática
                    autoCorrect={false} // Desactiva la autocorrección
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword} // Actualiza el estado 'password'
                    secureTextEntry={true} // Oculta los caracteres de la contraseña
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity>

                {/* Opcional: Enlaces para Recuperar Contraseña o Registrarse */}
                <TouchableOpacity onPress={() => Alert.alert('Info', 'Funcionalidad no implementada')}>
                    <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupa todo el espacio disponible
        backgroundColor: '#f0f0f0', // Un color de fondo suave
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center', // Centra el contenido horizontalmente
        paddingHorizontal: 30, // Espaciado a los lados
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30, // Espacio debajo del título
    },
    input: {
        width: '100%', // Ocupa todo el ancho disponible
        height: 50,
        backgroundColor: '#fff', // Fondo blanco para el input
        borderWidth: 1,
        borderColor: '#ddd', // Borde sutil
        borderRadius: 8, // Bordes redondeados
        paddingHorizontal: 15, // Espaciado interno horizontal
        marginBottom: 15, // Espacio debajo de cada input
        fontSize: 16,
        color: '#333', // Color del texto ingresado
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff', // Color azul típico para botones primarios
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10, // Espacio encima del botón
        elevation: 2, // Sombra leve en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    buttonText: {
        color: '#ffffff', // Texto blanco
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        marginTop: 20, // Espacio encima de los enlaces
        color: '#007bff', // Mismo color que el botón para consistencia
        fontSize: 14,
        textDecorationLine: 'underline', // Subrayado para indicar que es un enlace
    }
});

export default LoginScreen;