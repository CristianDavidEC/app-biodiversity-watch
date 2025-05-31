import * as ImagePicker from 'expo-image-picker';
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
    const [avatar, setAvatar] = useState<string | null>(null);

    const pickImage = async () => {
        try {
            // Solicitar permisos primero
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Error', 'Se necesitan permisos para acceder a la galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled) {
                setAvatar(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error al seleccionar imagen:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            console.log('Iniciando carga de imagen...');
            console.log('URI de la imagen:', uri);

            if (!uri.startsWith('file://') && !uri.startsWith('content://')) {
                throw new Error('URI de imagen inválida');
            }

            const filename = uri.split('/').pop();
            const fileExt = filename?.split('.').pop() || 'jpg';
            const filePath = `avatars/${Date.now()}.${fileExt}`;

            const formData = new FormData();
            formData.append('file', {
                uri,
                name: filename,
                type: `image/${fileExt}`,
            } as any);

            console.log('Subiendo imagen a Supabase...');
            const { data, error: uploadError } = await supabase.storage
                .from('biodiversity-files')
                .upload(filePath, formData, {
                    contentType: `image/${fileExt}`,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Error de Supabase:', uploadError);
                throw uploadError;
            }

            console.log('Imagen subida exitosamente');
            // Solo retorna la ruta interna
            return filePath;
        } catch (error: any) {
            console.error('Error detallado al subir imagen:', error);
            throw new Error(`Error al subir la imagen: ${error.message}`);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !name || !description || !profession) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        try {
            setLoading(true);
            console.log('Iniciando proceso de registro...');

            // 1. Registrar usuario en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        description,
                        profession
                    }
                }
            });

            if (authError) {
                console.error('Error en registro de auth:', authError);
                throw authError;
            }

            // 2. Si el usuario ya está autenticado (no requiere verificación de email)
            if (authData.session && authData.user) {
                let avatarUrl = null;
                if (avatar) {
                    try {
                        console.log('Subiendo imagen de perfil...');
                        avatarUrl = await uploadImage(avatar);
                        console.log('Ruta de la imagen:', avatarUrl);
                    } catch (error: any) {
                        console.error('Error al subir la imagen:', error);
                        Alert.alert('Advertencia', 'No se pudo subir la imagen de perfil. Continuando con el registro...');
                    }
                }
                // Actualizar el perfil con la URL del avatar
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ avatar_url: avatarUrl })
                    .eq('id', authData.user.id);

                if (profileError) {
                    console.error('Error al actualizar perfil:', profileError);
                    throw profileError;
                }

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
            } else {
                // Si requiere verificación de email, no se puede subir la imagen aún
                Alert.alert(
                    'Registro Exitoso',
                    'Por favor, verifica tu correo electrónico para activar tu cuenta. Podrás subir tu foto de perfil después de iniciar sesión.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/login')
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error('Error en el proceso de registro:', error);
            Alert.alert('Error', error.message || 'Error al registrar usuario');
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

                    <TouchableOpacity
                        onPress={pickImage}
                        className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#27AE60]"
                    >
                        {avatar ? (
                            <Image
                                source={{ uri: avatar }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-full bg-[#1E1E1E] justify-center items-center">
                                <Text className="text-[#27AE60] text-center">Agregar Foto</Text>
                            </View>
                        )}
                    </TouchableOpacity>

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