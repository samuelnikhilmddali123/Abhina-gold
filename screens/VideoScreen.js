import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const VIDEO_DATA = [
    { id: '1', videoId: 'dQw4w9WgXcQ', title: 'Abhinav Gold & Silver - Quality Purity' },
    { id: '2', videoId: 'dQw4w9WgXcQ', title: 'Traditional Jewellery Collection' },
    { id: '3', videoId: 'dQw4w9WgXcQ', title: 'Daily Rate Updates Info' },
];

const VideoScreen = ({ onScroll, headerHeight, videoData }) => {
    const insets = useSafeAreaInsets();
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);

    const renderVideoItem = ({ item }) => (
        <View style={styles.videoCard}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <View style={styles.videoWrapper}>
                <YoutubePlayer
                    height={width * 0.56} // 16:9 aspect ratio
                    play={false}
                    videoId={item.videoId}
                    onChangeState={onStateChange}
                />
            </View>
        </View>
    );

    const activeData = videoData || VIDEO_DATA;

    return (
        <View style={styles.container}>
            <FlatList
                data={activeData}
                keyExtractor={(item) => item.id}
                renderItem={renderVideoItem}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingTop: headerHeight + 20, paddingBottom: insets.bottom + 100 }
                ]}
                onScroll={onScroll}
                scrollEventThrottle={16}
                ListHeaderComponent={() => (
                    <View style={styles.headerSpacer}>
                        <Text style={styles.sectionTitle}>FEATURED VIDEOS</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <ActivityIndicator size="large" color="#8B004B" />
                        <Text style={styles.emptyText}>Loading videos...</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4C2C2', // Baby Pink base
    },
    listContent: {
        paddingHorizontal: 15,
    },
    headerSpacer: {
        marginBottom: 15,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#8B004B', // Deep Magenta
        letterSpacing: 2,
    },
    videoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B004B',
        padding: 15,
        backgroundColor: '#FFF5F8',
    },
    videoWrapper: {
        width: '100%',
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        color: '#8B004B',
        fontWeight: '600',
    },
});

export default VideoScreen;
