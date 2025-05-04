import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";

type GalleryItemProps = {
    image: string;
    description: string;
    date: string;
    id: string;
}

export default function ItemGalery(props: GalleryItemProps) {
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
                className="bg-stone-950 border border-stone-700 rounded-lg w-[48%] m-[1%] p-3">
                <Image source={{ uri: imageUrl! }} className="w-full h-40 object-contain rounded-sm" />
                <Text className='text-lg text-white'>{props.description}</Text>
                <Text className='text-xs text-gray-500'>{props.date}</Text>
            </Pressable>

        </Link>
    );
}