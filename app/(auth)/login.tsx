import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
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
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View className="h-[250px] w-full relative">
                <Image
                    source={require('../../assets/images/auth.png')}
                    className="w-full h-full "
                    resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/50" />
            </View>

            <View className="flex-1 px-8 pt-8 pb-12">
                <Text className="text-3xl font-bold text-white mb-2">
                    Bienvenido
                </Text>
                <Text className="text-base text-gray-400 mb-8">
                    Inicia sesión para continuar
                </Text>

                <TextInput
                    className="w-full h-[55px] bg-[#1E1E1E] rounded-xl px-5 mb-4 text-base text-white border border-gray-700"
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="next"
                />

                <TextInput
                    className="w-full h-[55px] bg-[#1E1E1E] rounded-xl px-5 mb-4 text-base text-white border border-gray-700"
                    placeholder="Contraseña"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                />

                <TouchableOpacity
                    className={`w-full h-[55px] bg-[#27AE60] justify-center items-center rounded-xl mt-5 shadow-lg ${loading ? 'bg-[#1E1E1E]' : ''}`}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#27AE60" />
                    ) : (
                        <Text className="text-white text-lg font-semibold">
                            Ingresar
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/forgot-password')}
                    disabled={loading}
                    className="mt-5"
                >
                    <Text className={`text-sm text-center ${loading ? 'text-gray-600' : 'text-[#27AE60]'}`}>
                        ¿Olvidaste tu contraseña?
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/register')}
                    disabled={loading}
                    className="mt-5"
                >
                    <Text className={`text-sm text-center ${loading ? 'text-gray-600' : 'text-[#27AE60]'}`}>
                        ¿No tienes cuenta? Regístrate
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default LoginScreen;