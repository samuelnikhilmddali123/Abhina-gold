import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ScrollingTicker = ({ tickerMessage }) => {
    const tickerTranslateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startTicker = () => {
            tickerTranslateX.setValue(width); // Start from right
            Animated.loop(
                Animated.timing(tickerTranslateX, {
                    toValue: -width * 4, // Scroll distance
                    duration: 30000,
                    useNativeDriver: true,
                    easing: Easing.linear,
                })
            ).start();
        };

        startTicker();
    }, [tickerMessage]);

    if (!tickerMessage) return null; // Don't show ticker if no message

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/de003dfa-a0fc-460b-b64e-96317a3eb9a0.png')}
                style={styles.imageBackground}
                resizeMode="stretch"
            >
                {/* Scrolling Content */}
                <View style={{ overflow: 'hidden', width: '100%', height: '100%', justifyContent: 'center' }}>
                    <Animated.View style={{
                        flexDirection: 'row',
                        transform: [{ translateX: tickerTranslateX }],
                        width: width * 8,
                        alignItems: 'center',
                    }}>
                        {[0, 1].map((iteration) => (
                            <View key={iteration} style={styles.tickerContent}>
                                <View style={styles.messageItem}>
                                    <Ionicons name="megaphone-outline" size={16} color="#FFD700" style={{ marginRight: 8 }} />
                                    <Text style={styles.messageText}>{tickerMessage}</Text>
                                </View>
                                <View style={{ width: 100 }} />
                            </View>
                        ))}
                    </Animated.View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 35, // Adjusted height for image visibility
        overflow: 'hidden',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    tickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 50,
    },
    rateItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rateLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFD700', // Gold color
        marginRight: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    rateValue: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    separator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FF4081',
        marginHorizontal: 15,
    },
});

export default ScrollingTicker;
