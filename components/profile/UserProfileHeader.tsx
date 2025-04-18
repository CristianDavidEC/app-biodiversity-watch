import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserProfileHeader() {
    return (
        <SafeAreaView>
            <View className="flex flex-col items-center border-b border-b-gray-400 m-3">
                <Image source={require('../../assets/images/profile.png')} className="w-32 h-32 rounded-full object-cover m-5" />
                <Text className='text-2xl text-blue-500 text-center'>Pepito Perez Pumarejo</Text>
                <Text className='text-lg text-gray-500 text-center'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut exercitationem nesciunt mollitia.</Text>
            </View>
        </SafeAreaView>
    );
}