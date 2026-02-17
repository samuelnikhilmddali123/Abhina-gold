import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const RatesScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Detailed Rates</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gold Varieties</Text>
                {[
                    { label: 'Gold 24k (99.9%)', buy: '6,150', sell: '6,100' },
                    { label: 'Gold 22k (91.6%)', buy: '5,650', sell: '5,600' },
                    { label: 'Gold 18k (75.0%)', buy: '4,612', sell: '4,560' },
                ].map((item, index) => (
                    <View key={index} style={styles.rateRow}>
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        <View style={styles.rateGroup}>
                            <Text style={styles.buyVal}>{item.buy}</Text>
                            <Text style={styles.sellVal}>{item.sell}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Silver Products</Text>
                {[
                    { label: 'Silver Fine (99.9)', buy: '75', sell: '72' },
                    { label: 'Silver Leg (92.5)', buy: '68', sell: '65' },
                    { label: 'Silver Coin (99.9)', buy: '78', sell: '74' },
                ].map((item, index) => (
                    <View key={index} style={styles.rateRow}>
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        <View style={styles.rateGroup}>
                            <Text style={styles.buyVal}>{item.buy}</Text>
                            <Text style={styles.sellVal}>{item.sell}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 16,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        marginTop: 10,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E3A8A',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 8,
    },
    rateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    itemLabel: {
        fontSize: 14,
        color: '#555',
    },
    rateGroup: {
        flexDirection: 'row',
    },
    buyVal: {
        fontSize: 14,
        color: '#1E3A8A',
        fontWeight: '700',
        width: 60,
        textAlign: 'right',
    },
    sellVal: {
        fontSize: 14,
        color: '#D11',
        fontWeight: '700',
        width: 60,
        textAlign: 'right',
    },
});

export default RatesScreen;
