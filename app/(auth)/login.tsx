import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert, // Para mostrar mensajes simples
    KeyboardAvoidingView, // Ayuda a que el teclado no tape los inputs
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../../lib/supabase';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        // Validación básica
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            if (data?.user) {
                // La navegación se maneja automáticamente por el AuthProvider
                // que detecta el cambio en el estado de autenticación
            }
        } catch (error: any) {
            let errorMessage = 'Error al iniciar sesión';

            // Manejo específico de errores comunes
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Correo o contraseña incorrectos';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Por favor, verifica tu correo electrónico antes de iniciar sesión';
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
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
                    editable={!loading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword} // Actualiza el estado 'password'
                    secureTextEntry={true} // Oculta los caracteres de la contraseña
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.buttonText}>Ingresar</Text>
                    )}
                </TouchableOpacity>

                {/* Opcional: Enlaces para Recuperar Contraseña o Registrarse */}
                <TouchableOpacity
                    onPress={() => Alert.alert('Info', 'Funcionalidad no implementada')}
                    disabled={loading}
                >
                    <Text style={[styles.linkText, loading && styles.linkTextDisabled]}>
                        ¿Olvidaste tu contraseña?
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/register')}
                    disabled={loading}
                >
                    <Text style={[styles.linkText, loading && styles.linkTextDisabled]}>
                        ¿No tienes cuenta? Regístrate
                    </Text>
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
    buttonDisabled: {
        backgroundColor: '#cccccc',
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
    },
    linkTextDisabled: {
        color: '#cccccc',
    }
});

export default LoginScreen;