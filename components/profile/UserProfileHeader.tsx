import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

interface Profile {
    name: string;
    profession: string;
    description: string;
    avatar_url: string | null;
}

export default function UserProfileHeader() {
    const [profile, setProfile] = useState<Profile>({
        name: '',
        profession: '',
        description: '',
        avatar_url: null
    });
    const [loading, setLoading] = useState(true);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('name, profession, description, avatar_url')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        console.error('Error al obtener el perfil:', error);
                        return;
                    }

                    if (data) {
                        setProfile({
                            name: data.name || '',
                            profession: data.profession || '',
                            description: data.description || '',
                            avatar_url: data.avatar_url || null
                        });
                        // Si hay avatar_url, genera la URL prefirmada
                        if (data.avatar_url) {
                            const { data: signedData, error: signedError } = await supabase.storage
                                .from('biodiversity-files')
                                .createSignedUrl(data.avatar_url, 60 * 60); // 1 hora
                            if (signedError) {
                                console.error('Error al generar URL prefirmada:', signedError);
                                setSignedUrl(null);
                            } else {
                                setSignedUrl(signedData?.signedUrl || null);
                            }
                        } else {
                            setSignedUrl(null);
                        }
                    }
                }
            } catch (error) {
                console.error('Error al cargar el perfil:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace("/(auth)/login");
        } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar la sesión. Por favor, inténtalo de nuevo.');
        }
    };

    const showLogoutMenu = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar tu sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Cerrar Sesión',
                    onPress: handleLogout,
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <SafeAreaView>
            <View className="flex flex-col items-center border-b border-b-gray-400 m-3">
                <View className="w-full flex-row justify-end pr-4">
                    <TouchableOpacity
                        onPress={showLogoutMenu}
                        className="p-2"
                    >
                        <FontAwesome name="sign-out" size={24} color="#ff6467" />
                    </TouchableOpacity>
                </View>
                <View className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#27AE60] mb-5">
                    {signedUrl ? (
                        <Image
                            source={{ uri: signedUrl }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={require('../../assets/images/user_default.png')}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    )}
                </View>
                <Text className='text-2xl text-emerald-500 text-center'>{loading ? 'Cargando...' : profile.name}</Text>
                <Text className='text-lg text-gray-500 text-center'>{loading ? '' : profile.profession}</Text>
                <Text className='text-lg text-gray-500 text-center'>{loading ? '' : profile.description}</Text>
            </View>
        </SafeAreaView>
    );
}