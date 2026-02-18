import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Animated } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CurvedHeader = ({ scrollY, onCall, onSearch, onNotify, rates }) => {
    const insets = useSafeAreaInsets();

    const MAX_HEIGHT = 280 + insets.top;
    const MIN_HEIGHT = 85 + insets.top;
    const SCROLL_DISTANCE = 180;

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
            {/* Background Color: Magenta */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#880E4F' }]} />

            {/* Blue Curve Line Decoration */}
            <Svg width={width} height={MAX_HEIGHT} style={StyleSheet.absoluteFill}>
                <Path
                    d={`M0,${MAX_HEIGHT * 0.6} C${width * 0.3},${MAX_HEIGHT * 0.4} ${width * 0.7},${MAX_HEIGHT * 0.2} ${width},${MAX_HEIGHT * 0.35}`}
                    stroke="#1E88E5" // Blue color
                    strokeWidth="3"
                    fill="none"
                />
            </Svg>

            {/* Main Content Area */}
            <Animated.View style={[styles.contentContainer, { paddingTop: insets.top + 10, opacity: contentOpacity }]}>
                {/* Left Side: Large Image */}
                <View style={styles.leftColumn}>
                    <Image
                        source={require('../assets/image1.jpeg')}
                        style={styles.largeImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Right Side: Icons, Title, Rates */}
                <View style={styles.rightColumn}>
                    {/* Top Row: Icons */}
                    <View style={styles.topIconsRow}>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#25D366' }]} onPress={onCall}>
                            <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'transparent' }]} onPress={onSearch}>
                            <Ionicons name="search" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#FFD700' }]} onPress={onNotify}>
                            <Ionicons name="notifications" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Middle: Title */}
                    <View style={styles.titleSection}>
                        <Text style={styles.mainTitle}>ABHINAV</Text>
                        <Text style={styles.subTitle}>GOLD & SILVER</Text>
                    </View>

                    {/* Bottom: Rates Row */}
                    <View style={styles.ratesRow}>
                        <View style={styles.rateItem}>
                            <Text style={styles.rateLabel}>GOLD</Text>
                            <Text style={styles.rateValue}>{getRate(0)}</Text>
                        </View>
                        <View style={styles.rateItem}>
                            <Text style={styles.rateLabel}>SILVER</Text>
                            <Text style={styles.rateValue}>{getRate(1)}</Text>
                        </View>
                        <View style={styles.rateItem}>
                            <Text style={styles.rateLabel}>USD</Text>
                            <Text style={styles.rateValue}>{getRate(2)}</Text>
                        </View>
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
        backgroundColor: '#880E4F',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    leftColumn: {
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    largeImage: {
        width: '100%',
        height: '90%',
    },
    rightColumn: {
        width: '60%',
        paddingLeft: 10,
        justifyContent: 'space-around',
        paddingBottom: 20,
    },
    topIconsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 15,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFD700',
        letterSpacing: 1,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFD700',
        marginTop: 2,
        letterSpacing: 1,
        textAlign: 'center',
    },
    ratesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    rateItem: {
        alignItems: 'center',
    },
    rateLabel: {
        fontSize: 12,
        color: '#FFD700',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    rateValue: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
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
