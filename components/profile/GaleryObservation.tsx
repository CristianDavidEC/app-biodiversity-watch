import { FlatList } from "react-native";
import ItemGalery from "./ItemGalery";


export default function GaleryObservation({ header }: any) {

    const galeryData = [
        {
            id: '1',
            image: '../../assets/images/profile.png',
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: '2',
            image: '../../assets/images/profile.png',
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: '3',
            image: '../../assets/images/profile.png',
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: '4',
            image: '../../assets/images/profile.png',
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: '5',
            image: '../../assets/images/profile.png',
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: '6',
            image: '../../assets/images/profile.png',
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: '7',
            image: '../../assets/images/profile.png',
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        }
    ]

    return (
        <FlatList
            data={galeryData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ItemGalery {...item} />}
            numColumns={2}
            ListHeaderComponent={header}
        >
        </FlatList>
    );
}