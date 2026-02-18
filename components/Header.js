import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import colors from '../themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const Header = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Curved Blue Background */}
            <View style={[styles.blueBackground, { height: 180 + insets.top }]}>
                <View style={styles.curve} />
            </View>

            <View style={[styles.content, { paddingTop: insets.top + 10 }]}>
                {/* Logo Section */}
                <View style={styles.logoRow}>
                    <Image
                        source={require('../assets/divya.png')}
                        style={styles.diyaLogo}
                        resizeMode="contain"
                    />
                </View>

                {/* Title Section */}
                <View style={styles.titleRow}>
                    <Text style={styles.mainTitle}>ABHINAV</Text>
                    <View style={styles.iconGroup}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Text style={styles.emojiIcon}>📞</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Text style={styles.emojiIcon}>🔍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Text style={styles.emojiIcon}>🔔</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.subTitle}>Gold & Silver</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    blueBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E3A8A',
        borderBottomLeftRadius: 100, // Partial curve
        overflow: 'hidden',
    },
    curve: {
        position: 'absolute',
        bottom: -50,
        left: -50,
        right: -50,
        height: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 1000,
        transform: [{ scaleX: 1.5 }],
    },
    content: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    logoRow: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: -10,
    },
    diyaLogo: {
        width: 80,
        height: 80,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1E3A8A',
        letterSpacing: 2,
    },
    iconGroup: {
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
    },
    iconBtn: {
        marginLeft: 15,
    },
    emojiIcon: {
        fontSize: 20,
        color: '#1E3A8A',
    },
    subTitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: -5,
        fontWeight: '500',
    },
});

export default Header;