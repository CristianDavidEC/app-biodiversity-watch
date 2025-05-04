import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    Image,
    Dimensions,
    StyleSheet,
    ViewToken,
    ImageSourcePropType,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ImageCarouselProps {
    images: ImageSourcePropType[];
    dotColor?: string;
    activeDotColor?: string;
    imageResizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
    images,
    imageResizeMode = 'contain',
}) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                setActiveIndex(viewableItems[0].index);
            }
        },
        []
    );

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = useCallback(
        ({ item }: { item: ImageSourcePropType }) => (
            <View style={[{ width: screenWidth }]}>
                <Image
                    source={item}
                    style={[{ height: 200 }]}
                    resizeMode={imageResizeMode}
                    className='rounded-lg w-full h-full'
                />
            </View>
        ),
        [200]
    );

    const renderPagination = () => {
        if (images.length <= 1) {
            return null;
        }
        return (
            <View style={styles.paginationContainer}>
                {images.map((_, index) => (
                    <View
                        key={`dot-${index}`}
                        style={[
                            {
                                backgroundColor:
                                    index === activeIndex ? "#4E9889" : "#CCCCCC",
                            },
                        ]}
                        className='rounded-full w-2 h-2 mx-1'
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={[styles.container, { height: 200 }]}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                keyExtractor={(_item, index) => `carousel-item-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                style={{ width: screenWidth }}
                getItemLayout={(_data, index) => (
                    { length: screenWidth, offset: screenWidth * index, index }
                )}
                bounces={false}
            />
            {renderPagination()}
        </View>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        position: 'relative',
        backgroundColor: '#00000',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ImageCarousel;