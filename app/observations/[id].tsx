import DetailsObservation from "@/components/observations/DetailsObservation";
import ImageCarousel from "@/components/observations/ImageCarousel";
import { ScrollView } from "react-native";

export default function ObservationDetail() {

    const sampleImages = [
        { uri: 'https://fastly.picsum.photos/id/767/300/200.jpg?hmac=TTc0t0lEJWrTHSWhos7VTReXgTKIk-OUc3fQA1w91sI' },
        { uri: 'https://fastly.picsum.photos/id/882/300/200.jpg?hmac=8GSRyxTZ_rDVbOY6lS_4IA21EvGACEpqyewI1KZXAh0' },
        { uri: 'https://fastly.picsum.photos/id/982/200/300.jpg?hmac=xTKU9lOLW4f1_EmdynREJoYXZ7jXQUnwUNcYa6Nf4WA' },
    ]

    return (
        <ScrollView className="flex-1 bg-black">
            <ImageCarousel
                images={sampleImages} />
            <DetailsObservation />
        </ScrollView>
    );
}