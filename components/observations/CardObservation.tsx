import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text } from "react-native";

type GalleryItemProps = {
    image: string;
    description: string;
    date: string;
    id: string;
    location: string;
}

export default function CardObservation(props: GalleryItemProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const fetchRandomImage = async () => {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            setImageUrl(data.message);
        } catch (error) {
            console.error('Error fetching image:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchRandomImage(); // Fetch one when component mounts
    }, []);

    return (
        <Link href={{ pathname: "/observations/[id]", params: { id: props.id } }} asChild>
            <Pressable
                onPress={() => console.log('Pressed!')}
                className="bg-stone-950 border border-stone-700 rounded-lg w-[98%] m-[1%] p-3">
                <Image source={{ uri: imageUrl! }} className="w-full h-72 object-contain rounded-sm mb-3" />
                <Text className='text-xs text-gray-500'>{props.date}</Text>
                <Text className='text-lg text-white'>{props.description}</Text>
                <Text className='text-xs text-gray-500'>{props.location}</Text>
            </Pressable>

        </Link>
    );
}