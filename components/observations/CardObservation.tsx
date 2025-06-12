import { Link } from "expo-router";
import { Image, Pressable, Text } from "react-native";

const PLACEHOLDER_IMAGE = require('../../assets/images/profile.png');

type GalleryItemProps = {
    image: string;
    description: string;
    date: string;
    id: string;
    location: string;
    specie_common_name?: string;
    specie_scientific_name?: string;
    coordinate?: {
        latitude: number;
        longitude: number;
    };
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
                {props.specie_common_name && (
                    <Text className='text-base text-emerald-400 font-bold mt-1'>{props.specie_common_name}</Text>
                )}
                {props.specie_scientific_name && (
                    <Text className='text-sm text-gray-300 italic'>{props.specie_scientific_name}</Text>
                )}
                <Text className='text-xs text-gray-500'>{props.location}</Text>
            </Pressable>
        </Link>
    );
}