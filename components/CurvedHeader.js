import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CurvedHeader = ({ onCall, onSearch, onNotify }) => {
    const insets = useSafeAreaInsets();
    const totalHeight = 240 + insets.top;

    return (
        <View style={[styles.container, { height: totalHeight }]}>
            <View style={StyleSheet.absoluteFill}>
                <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
            </View>

            <View style={styles.svgContainer}>
                <Svg width={width} height={totalHeight} viewBox={`0 0 ${width} ${totalHeight}`} preserveAspectRatio="none">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor="#1E3A8A" />
                            <Stop offset="100%" stopColor="#12255a" />
                        </LinearGradient>
                    </Defs>
                    <Path
                        d={`M0,${180 + insets.top} C${width * 0.4},${220 + insets.top} ${width * 0.75},${40 + insets.top} ${width},${60 + insets.top} V${totalHeight} H0 Z`}
                        fill="url(#grad)"
                        stroke="#93C5FD"
                        strokeWidth="3"
                    />
                </Svg>
            </View>

            <View style={[styles.overlay, { paddingTop: insets.top + 5 }]}>
                <View style={styles.topRow}>
                    <View style={{ width: 80 }} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>ABHINA</Text>
                        <Text style={styles.subTitle}>Gold & Silver</Text>
                    </View>
                    <View style={styles.iconGroup}>
                        <TouchableOpacity style={styles.iconBtn} onPress={onCall}>
                            <Text style={styles.emojiIcon}>📞</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={onSearch}>
                            <Text style={styles.emojiIcon}>🔍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={onNotify}>
                            <Text style={styles.emojiIcon}>🔔</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.diyaContainer}>
                    <Image
                        source={require('../assets/divya.png')}
                        style={styles.diyaImage}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    svgContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        flex: 1,
        paddingHorizontal: 16,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
    },
    titleContainer: {
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1E3A8A',
        letterSpacing: 2,
    },
    subTitle: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: -3,
    },
    iconGroup: {
        flexDirection: 'row',
    },
    iconBtn: {
        marginLeft: 12,
        padding: 5,
    },
    emojiIcon: {
        fontSize: 20,
        color: '#1E3A8A',
    },
    diyaContainer: {
        position: 'absolute',
        left: 10,
        top: 60,
    },
    diyaImage: {
        width: 100,
        height: 100,
    },
});

export default CurvedHeader;
