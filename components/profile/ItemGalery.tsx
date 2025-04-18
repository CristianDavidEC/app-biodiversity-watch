import { View, Text, Image } from "react-native";

type GalleryItemProps = {
    imageUrl: string;
    description: string;
    date: string;
}

export default function ItemGalery(props: GalleryItemProps) {
    const { imageUrl, description, date } = props

    return (
        <View className="bg-stone-950 border border-stone-700 rounded-lg w-[48%] m-[1%] p-3">
            <Image source={require('../../assets/images/profile.png')} className="w-full h-40 object-contain rounded-sm" />
            <Text className='text-lg text-white'>{description}</Text>
            <Text className='text-xs text-gray-500'>{date}</Text>
        </View>
    );
}