import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const SHORTS_DATA = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000',
        title: 'Bridal Gold Collection',
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1000',
        title: 'Modern Diamond Sets',
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1000',
        title: 'Traditional Temple Jewellery',
    },
];

const ARTICLES_DATA = [
    {
        id: '1',
        title: 'Investment Guide: Why hold gold in 2026?',
        excerpt: 'Financial experts suggest gold as the ultimate hedge against market volatility...',
    },
    {
        id: '2',
        title: 'Caring for your Diamond sets',
        excerpt: 'Simple tips to keep your precious stones sparkling for generations...',
    },
];

const NewsScreen = ({ onScroll, headerHeight }) => {
    const scrollRef = React.useRef(null);
    const [playingId, setPlayingId] = React.useState(null);
    const [isMuted, setIsMuted] = React.useState(false);

    const scrollTo = (index) => {
        scrollRef.current?.scrollTo({ x: index * (CARD_WIDTH + 20), animated: true });
    };

    const togglePlay = (id) => {
        setPlayingId(playingId === id ? null : id);
        if (playingId !== id) Alert.alert('Video Simulation', 'Playing Jewellery Collection Short...');
    };
    return (
        <Animated.ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingTop: headerHeight }]}
            onScroll={onScroll}
            scrollEventThrottle={16}
        >
            <View style={styles.headerSection}>
                <Text style={styles.sectionTitle}>OUR JEWELLERY DESIGN COLLECTIONS</Text>
                <View style={styles.goldUnderline} />
            </View>

            <View style={styles.carouselContainer}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH + 20}
                    decelerationRate="fast"
                    contentContainerStyle={styles.carouselContent}
                >
                    {SHORTS_DATA.map((item, index) => (
                        <View key={item.id} style={styles.shortCard}>
                            <Image source={{ uri: item.image }} style={styles.shortImage} />
                            <View style={styles.shortOverlay}>
                                <TouchableOpacity style={styles.playBtn} onPress={() => togglePlay(item.id)}>
                                    <Text style={styles.playIcon}>{playingId === item.id ? '⏸️' : '▶️'}</Text>
                                </TouchableOpacity>
                                <View style={styles.bottomControls}>
                                    <View style={styles.controlIcon}>
                                        <Text style={styles.iconTxt}>{playingId === item.id ? '⏸️' : '▶️'}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.controlIcon} onPress={() => setIsMuted(!isMuted)}>
                                        <Text style={styles.iconTxt}>{isMuted ? '🔇' : '🔊'}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.controlIcon}><Text style={styles.iconTxt}>🔲</Text></View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.navArrowLeft} onPress={() => scrollTo(Math.max(0, index - 1))}>
                                <Text style={styles.arrowIcon}>{'<'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navArrowRight} onPress={() => scrollTo(Math.min(SHORTS_DATA.length - 1, index + 1))}>
                                <Text style={styles.arrowIcon}>{'>'}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.articleSection}>
                <Text style={styles.articleSectionTitle}>Latest Articles</Text>
                <Text style={styles.articleSubtitle}>Read our latest insights and stories</Text>

                {ARTICLES_DATA.map((article) => (
                    <View key={article.id} style={styles.articleCard}>
                        <Text style={styles.articleTitle}>{article.title}</Text>
                        <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
                    </View>
                ))}
            </View>
        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        paddingBottom: 40,
    },
    headerSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1a3a3a',
        textAlign: 'center',
        letterSpacing: 1,
    },
    goldUnderline: {
        width: 60,
        height: 4,
        backgroundColor: '#FFD700',
        marginTop: 10,
    },
    carouselContainer: {
        marginBottom: 40,
    },
    carouselContent: {
        paddingHorizontal: 20,
    },
    shortCard: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.5,
        marginRight: 20,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#000',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    shortImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    shortOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    playIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    bottomControls: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
    },
    controlIcon: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
    },
    iconTxt: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    navArrowLeft: {
        position: 'absolute',
        left: 10,
        top: '50%',
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    navArrowRight: {
        position: 'absolute',
        right: 10,
        top: '50%',
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    arrowIcon: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    articleSection: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    articleSectionTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1a3a3a',
        marginBottom: 5,
    },
    articleSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    articleCard: {
        width: '100%',
        backgroundColor: '#FDF2F8',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: '#880E4F',
    },
    articleTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#880E4F',
        marginBottom: 5,
    },
    articleExcerpt: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
});

export default NewsScreen;
