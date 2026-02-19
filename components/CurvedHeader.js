import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Animated } from 'react-native';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CurvedHeader = ({ scrollY, onCall, onSearch, onNotify, onAdmin, showAdmin, rates }) => {
    const insets = useSafeAreaInsets();

    const MAX_HEIGHT = 330 + insets.top;
    const MIN_HEIGHT = 90 + insets.top;
    const SCROLL_DISTANCE = 240;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [MAX_HEIGHT, MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const contentOpacity = scrollY.interpolate({
        inputRange: [0, SCROLL_DISTANCE / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const compactOpacity = scrollY.interpolate({
        inputRange: [SCROLL_DISTANCE * 0.6, SCROLL_DISTANCE],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // Helper to format rates safely
    const getRate = (index, type = 'ask') => {
        if (!rates || !rates.spot || !rates.spot[index]) return '-';
        return rates.spot[index][type];
    };

    return (
        <Animated.View style={[
            styles.container,
            { height: headerHeight }
        ]}>
            {/* Background Linear Gradient for the entire header area */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width} height="100%" style={StyleSheet.absoluteFill}>
                    <Defs>
                        <LinearGradient id="magentaThemeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#6A0039" />
                            <Stop offset="100%" stopColor="#8B004B" />
                        </LinearGradient>
                        <LinearGradient id="borderTwoToneGradient" x1="0%" y1="0" x2="1" y2="0">
                            <Stop offset="0%" stopColor="#8B004B" />
                            <Stop offset="42%" stopColor="#8B004B" />
                            <Stop offset="100%" stopColor="#C2187A" />
                        </LinearGradient>
                        <RadialGradient
                            id="idolBlendGradient"
                            cx="20%"
                            cy="35%"
                            rx="50%"
                            ry="50%"
                            fx="20%"
                            fy="35%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0%" stopColor="#B00669" stopOpacity="1" />
                            <Stop offset="100%" stopColor="#8B004B" stopOpacity="1" />
                        </RadialGradient>
                        <LinearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                            <Stop offset="100%" stopColor="transparent" />
                        </LinearGradient>
                    </Defs>

                    {/* Main Curved Shape - Integrated Magenta Branding background with Idol Radial Blend */}
                    <Path
                        d={`M0,0 L${width},0 L${width},${MAX_HEIGHT * 0.48} C${width * 0.7},${MAX_HEIGHT * 0.43} ${width * 0.3},${MAX_HEIGHT * 1.1} 0,${MAX_HEIGHT * 0.9} Z`}
                        fill="url(#idolBlendGradient)"
                    />

                    {/* Two-Tone transition border edge (Magenta to Pink) */}
                    <Path
                        d={`M0,${MAX_HEIGHT * 0.9} C${width * 0.3},${MAX_HEIGHT * 1.1} ${width * 0.7},${MAX_HEIGHT * 0.43} ${width},${MAX_HEIGHT * 0.48} L${width},${MAX_HEIGHT * 0.51} C${width * 0.7},${MAX_HEIGHT * 0.46} ${width * 0.3},${MAX_HEIGHT * 1.13} 0,${MAX_HEIGHT * 0.93} Z`}
                        fill="url(#borderTwoToneGradient)"
                    />
                </Svg>
            </View>

            {/* Idol Image - Full visibility with proper spacing */}
            <Animated.View style={[styles.idolOverlay, { top: insets.top + 15, opacity: contentOpacity }]}>
                <Image
                    source={require('../assets/Untitled design (4).png')}
                    style={styles.idolImage}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Rates Section (Cleanly aligned below the title/curve) */}
            <Animated.View style={[styles.ratesContainer, { opacity: contentOpacity, bottom: 20 }]}>
                <View style={styles.ratesRow}>
                    <View style={styles.rateItem}>
                        <Text style={styles.rateLabel}>GOLD</Text>
                        <Text style={styles.rateValue}>{getRate(0)}</Text>
                    </View>
                    <View style={styles.rateItemSeparator} />
                    <View style={styles.rateItem}>
                        <Text style={styles.rateLabel}>SILVER</Text>
                        <Text style={styles.rateValue}>{getRate(1)}</Text>
                    </View>
                    <View style={styles.rateItemSeparator} />
                    <View style={styles.rateItem}>
                        <Text style={styles.rateLabel}>USD</Text>
                        <Text style={styles.rateValue}>{getRate(2)}</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Compact Header (Visible when scrolled) */}
            <Animated.View style={[
                styles.compactHeader,
                { paddingTop: insets.top, opacity: compactOpacity }
            ]}>
                <Text style={styles.compactTitle}>ABHINAV GOLD</Text>
            </Animated.View>

            {/* Brand Header Area (Title & Icons) - MOVED TO TOP LAYER */}
            <Animated.View style={[styles.brandContainer, { paddingTop: insets.top + 10, opacity: contentOpacity }]}>
                <View style={styles.rightColumn}>
                    {/* Top Row: Icons */}
                    <View style={styles.topIconsRow}>
                        {showAdmin && (
                            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#8B004B', marginRight: 8 }]} onPress={onAdmin}>
                                <Ionicons name="person-circle" size={20} color="#FFF" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#25D366' }]} onPress={onCall}>
                            <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'transparent' }]} onPress={onSearch}>
                            <Ionicons name="search" size={22} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#FFD700' }]} onPress={onNotify}>
                            <Ionicons name="notifications" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Middle: Title */}
                    <View style={styles.titleSection}>
                        <Text style={styles.mainTitle}>ABHINAV</Text>
                        <Text style={styles.subTitle}>GOLD & SILVER</Text>
                    </View>
                </View>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        overflow: 'hidden',
        backgroundColor: '#F4C2C2', // Updated to Baby Pink for a more vibrant luxury base
    },
    brandContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    idolOverlay: {
        position: 'absolute',
        left: 15,
        width: '42%',
        height: '75%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    idolImage: {
        width: '100%',
        height: '100%',
        opacity: 0.96, // Slight transparency to help blend with the radial background
    },
    rightColumn: {
        width: '100%',
        paddingLeft: '46%', // Increased space for the larger idol
        justifyContent: 'center',
    },
    topIconsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 5,
    },
    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 5,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFD700',
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFD700',
        marginTop: 4,
        letterSpacing: 1.5,
        textAlign: 'center',
    },
    ratesContainer: {
        position: 'absolute',
        bottom: 12,
        left: '42%',
        right: 15,
    },
    ratesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    rateItem: {
        flex: 1,
        alignItems: 'center',
    },
    rateItemSeparator: {
        width: 1,
        height: '40%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    rateLabel: {
        fontSize: 10,
        color: '#000000',
        fontWeight: 'bold',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    rateValue: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '400', // Normal weight for values
    },
    compactHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    compactTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        letterSpacing: 1,
    },
});

export default CurvedHeader;
