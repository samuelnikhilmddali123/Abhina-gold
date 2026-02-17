import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const NEWS_DATA = [
    {
        id: '1',
        title: 'Gold prices hit record high amid global uncertainty',
        date: 'Oct 24, 2023',
        summary: 'Gold prices reached a new milestone today as investors seek safe-haven assets...',
    },
    {
        id: '2',
        title: 'Market Analysis: Silver trends for the coming week',
        date: 'Oct 23, 2023',
        summary: 'Experts predict a steady climb for silver as industrial demand continues to rise...',
    },
    {
        id: '3',
        title: 'New mining regulations announced in major gold producing regions',
        date: 'Oct 22, 2023',
        summary: 'The latest policy shifts are expected to impact global supply chains in the long run...',
    },
];

const NewsScreen = () => {
    const renderItem = ({ item }) => (
        <View style={styles.newsCard}>
            <Text style={styles.newsDate}>{item.date}</Text>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSummary}>{item.summary}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Market News</Text>
            <FlatList
                data={NEWS_DATA}
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
    newsCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    newsDate: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    newsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E3A8A',
        marginBottom: 8,
    },
    newsSummary: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default NewsScreen;
