import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { getSignedImageUrl } from '../../lib/utils/getSignedImageUrl';

// Puedes cambiar esta ruta por la de tu imagen placeholder local
const PLACEHOLDER_IMAGE = require('../../assets/images/profile.png');

type GalleryItemProps = {
    image: string;
    description: string;
    date: string;
    id: string;
}

export default function ItemGalery(props: GalleryItemProps) {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchUrl = async () => {
            setLoading(true);
            if (props.image) {
                const url = await getSignedImageUrl(props.image);
                if (isMounted) setSignedUrl(url);
            } else {
                setSignedUrl(null);
            }
            setLoading(false);
        };
        fetchUrl();
        return () => { isMounted = false; };
    }, [props.image]);

    return (
        <Link href={{ pathname: "/observations/[id]", params: { id: props.id } }} asChild>
            <Pressable
                onPress={() => console.log('Pressed!')}
                className="bg-stone-950 border border-stone-700 rounded-lg w-[48%] m-[1%] p-3">
                {loading ? (
                    <View className="w-full h-40 items-center justify-center">
                        <ActivityIndicator size="large" color="#0E9F6E" />
                    </View>
                ) : (
                    <Image
                        source={signedUrl ? { uri: signedUrl } : PLACEHOLDER_IMAGE}
                        className="w-full h-40 object-contain rounded-sm"
                    />
                )}
                <Text className='text-lg text-white'>{props.description}</Text>
                <Text className='text-xs text-gray-500'>{props.date}</Text>
            </Pressable>
        </Link>
    );
}