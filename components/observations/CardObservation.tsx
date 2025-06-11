import { Link } from "expo-router";
import { Image, Pressable, Text } from "react-native";

const PLACEHOLDER_IMAGE = require('../../assets/images/profile.png');

type GalleryItemProps = {
    image: string;
    description: string;
    date: string;
    id: string;
    location: string;
}

export default function CardObservation(props: GalleryItemProps) {
    return (
        <Link href={{ pathname: "/observations/[id]", params: { id: props.id } }} asChild>
            <Pressable
                onPress={() => console.log('Pressed!')}
                className="bg-stone-950 border border-stone-700 rounded-lg w-[85%] m-[1%] p-3 self-center">
                <Image
                    source={props.image ? { uri: props.image } : PLACEHOLDER_IMAGE}
                    className="w-full h-72 object-contain rounded-sm mb-3"
                />
                <Text className='text-xs text-gray-500'>{props.date}</Text>
                <Text className='text-lg text-white'>{props.description}</Text>
                <Text className='text-xs text-gray-500'>{props.location}</Text>
            </Pressable>
        </Link>
    );
}