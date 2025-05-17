import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../../lib/supabase';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Por favor, ingresa tu correo electrónico.');
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'biodiversitywatchapp://reset-password',
            });

            if (error) throw error;

            Alert.alert(
                'Correo Enviado',
                'Se ha enviado un enlace de recuperación a tu correo electrónico.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/login')
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-[#121212]"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View className="h-[250px] w-full relative">
                <Image
                    source={require('../../assets/images/psd.png')}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/50" />
            </View>

            <View className="flex-1 px-8 pt-8 pb-12">
                <Text className="text-3xl font-bold text-white mb-2">
                    Recuperar Contraseña
                </Text>
                <Text className="text-base text-gray-400 mb-8">
                    Ingresa tu correo electrónico para recibir instrucciones de recuperación
                </Text>

                <TextInput
                    className="w-full h-[55px] bg-[#1E 1E1E] rounded-xl px-5 mb-4 text-base text-white border border-gray-700"
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={handleResetPassword}
                />

                <TouchableOpacity
                    className={`w-full h-[55px] bg-[#27AE60] justify-center items-center rounded-xl mt-5 shadow-lg ${loading ? 'bg-[#1E1E1E]' : ''}`}
                    onPress={handleResetPassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#27AE60" />
                    ) : (
                        <Text className="text-white text-lg font-semibold">
                            Enviar Instrucciones
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-5"
                >
                    <Text className="text-[#27AE60] text-sm text-center">
                        Volver al inicio de sesión
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ForgotPasswordScreen; 