import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [profession, setProfession] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !name || !description || !profession) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        try {
            setLoading(true);

            // 1. Registrar usuario en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Crear perfil en la tabla de perfiles
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            name,
                            description,
                            profession,
                            email
                        }
                    ]);

                if (profileError) throw profileError;

                Alert.alert(
                    'Registro Exitoso',
                    'Por favor, verifica tu correo electrónico para activar tu cuenta.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/login')
                        }
                    ]
                );
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-[#121212]"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="h-[200px] w-full relative">
                    <Image
                        source={require('../../assets/images/register.png')}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/50" />
                </View>

                <View className="flex-1 px-8 pt-8 pb-12">
                    <Text className="text-3xl font-bold text-white mb-2">
                        Crear Cuenta
                    </Text>
                    <Text className="text-base text-gray-400 mb-8">
                        Únete a nuestra comunidad
                    </Text>

                    <TextInput
                        className="w-full h-[55px] bg-[#1E1E1E] rounded-xl px-5 mb-4 text-base text-white border border-gray-700"
                        placeholder="Nombre Completo"
                        placeholderTextColor="#666"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        returnKeyType="next"
                    />

                    <TextInput
                        className="w-full h-[55px] bg-[#1E1E1E] rounded-xl px-5 mb-4 text-base text-white border border-gray-700"
                        placeholder="Correo Electrónico"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                    />

                    <TextInput
                        className="w-full h-[55px] bg-[#1E1E1E] rounded-xl px-5 mb-4 text-base text-white border border-gray-700"
                        placeholder="Contraseña"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        returnKeyType="next"
                    />

                    <TextInput
                        className="w-full h-[55px] bg-[#1E1E1E] rounded-xl px-5 mb-4 text-base text-white border border-gray-700"
                        placeholder="Profesión"
                        placeholderTextColor="#666"
                        value={profession}
                        onChangeText={setProfession}
                        autoCapitalize="words"
                        returnKeyType="next"
                    />

                    <TextInput
                        className="w-full h-[120px] bg-[#1E1E1E] rounded-xl px-5 pt-4 mb-4 text-base text-white border border-gray-700"
                        placeholder="Descripción de tu perfil"
                        placeholderTextColor="#666"
                        value={description}
                        onChangeText={setDescription}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                    />

                    <TouchableOpacity
                        className={`w-full h-[55px] bg-[#27AE60] justify-center items-center rounded-xl mt-5 shadow-lg ${loading ? 'bg-[#1E1E1E]' : ''}`}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text className="text-white text-lg font-semibold">
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.replace('/login')}
                        className="mt-5"
                    >
                        <Text className="text-[#27AE60] text-sm text-center">
                            ¿Ya tienes cuenta? Inicia sesión
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen; 