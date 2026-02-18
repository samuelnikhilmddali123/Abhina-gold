import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RateTable = ({ title, columns, data, highlightAskColor = '#FF0000' }) => {
    return (
        <View style={styles.container}>
            {/* Table Header Wrapper */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={styles.headerLine} />
            </View>

            {/* Table columns headers */}
            <View style={styles.columnHeadersRow}>
                <Text style={[styles.columnHeader, { flex: 2 }]}>PRODUCT NAME</Text>
                {columns.map((col, index) => (
                    <Text key={index} style={styles.columnHeader}>{col.toUpperCase()}</Text>
                ))}
            </View>

            {/* Table Data */}
            {data.map((item, index) => (
                <View key={index} style={[styles.dataRow, index % 2 === 1 && styles.oddRow]}>
                    <Text style={[styles.productName, { flex: 2 }]}>{item.product || item.name}</Text>
                    {columns.map((col, idx) => {
                        const val = item[col.toLowerCase()];
                        const isAsk = col.toLowerCase() === 'ask';
                        const isStock = col.toLowerCase() === 'stock';

                        if (isStock) {
                            return (
                                <View key={idx} style={styles.centeredCell}>
                                    <Text style={styles.stockIcon}>{val ? '✅' : '❌'}</Text>
                                </View>
                            );
                        }

                        return (
                            <Text
                                key={idx}
                                style={[
                                    styles.dataCell,
                                    isAsk && val !== '-' ? { color: highlightAskColor } : null
                                ]}
                            >
                                {val === null || val === undefined ? '-' : val.toLocaleString()}
                            </Text>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 10,
        marginTop: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#880E4F',
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#880E4F',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    headerTitle: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    columnHeadersRow: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        paddingVertical: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    columnHeader: {
        flex: 1,
        fontSize: 11,
        fontWeight: '900',
        color: '#880E4F',
        textAlign: 'center',
    },
    dataRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        alignItems: 'center',
    },
    evenRow: {
        backgroundColor: '#FFFFFF',
    },
    oddRow: {
        backgroundColor: '#FAFAFA',
    },
    productName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333333',
        paddingLeft: 5,
    },
    dataCell: {
        flex: 1,
        fontSize: 13,
        fontWeight: '800',
        color: '#000000',
        textAlign: 'center',
    },
    centeredCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stockIcon: {
        fontSize: 14,
    },
});

export default RateTable;
