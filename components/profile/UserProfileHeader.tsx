import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function UserProfileHeader() {
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
                        <FontAwesome name="sign-out" size={24} color="#ef4444" />
                    </TouchableOpacity>
                </View>
                <Image source={require('../../assets/images/profile.png')} className="w-32 h-32 rounded-full object-cover m-5" />
                <Text className='text-2xl text-blue-500 text-center'>Pepito Perez Pumarejo</Text>
                <Text className='text-lg text-gray-500 text-center'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut exercitationem nesciunt mollitia.</Text>
            </View>
        </SafeAreaView>
    );
}