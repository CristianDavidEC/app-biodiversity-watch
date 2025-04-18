import { FlatList, SafeAreaView } from "react-native";
import ItemGalery from "./ItemGalery";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function GaleryObservation({ header }: any) {
    const insets = useSafeAreaInsets();

    const galeryData = [
        {
            id: 1,
            image: require('../../assets/images/profile.png'),
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: 2,
            image: require('../../assets/images/profile.png'),
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: 3,
            image: require('../../assets/images/profile.png'),
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: 4,
            image: require('../../assets/images/profile.png'),
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: 5,
            image: require('../../assets/images/profile.png'),
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: 6,
            image: require('../../assets/images/profile.png'),
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        },
        {
            id: 7,
            image: require('../../assets/images/profile.png'),
            description: 'Lorem ipsum dolor sit amet',
            date: '24 Sep 2023'
        }
    ]

    return (
        <FlatList
            data={galeryData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ItemGalery imageUrl={item.image} description={item.description} date={item.date} />}
            numColumns={2}
            ListHeaderComponent={header}
        >
        </FlatList>
    );
}