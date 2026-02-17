import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ALERTS_DATA = [
    {
        id: '1',
        type: 'Price Drop',
        message: 'Gold 24k dropped below 6,100',
        time: '2 hours ago',
        icon: '📉',
    },
    {
        id: '2',
        type: 'Price Surge',
        message: 'Silver hit intraday high of 78',
        time: '5 hours ago',
        icon: '📈',
    },
    {
        id: '3',
        type: 'System',
        message: 'Projected market trends updated for November',
        time: '1 day ago',
        icon: '⚙️',
    },
];

const AlertsScreen = () => {
    const renderItem = ({ item }) => (
        <View style={styles.alertCard}>
            <Text style={styles.alertIcon}>{item.icon}</Text>
            <View style={styles.alertInfo}>
                <View style={styles.alertHeader}>
                    <Text style={styles.alertType}>{item.type}</Text>
                    <Text style={styles.alertTime}>{item.time}</Text>
                </View>
                <Text style={styles.alertMsg}>{item.message}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Notifications</Text>
            <FlatList
                data={ALERTS_DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
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
    listContent: {
        paddingBottom: 100,
    },
    alertCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    alertIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    alertInfo: {
        flex: 1,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    alertType: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E3A8A',
    },
    alertTime: {
        fontSize: 12,
        color: '#AAA',
    },
    alertMsg: {
        fontSize: 14,
        color: '#555',
    },
});

export default AlertsScreen;
