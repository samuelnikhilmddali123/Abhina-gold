import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../themes/colors';

const RetailPriceRow = ({ icon, label, price }) => {
  return (
    <View style={styles.rowContainer}>
      <View style={styles.leftSection}>
        {icon && <Image source={icon} style={styles.itemIcon} resizeMode="contain" />}
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price?.toLocaleString()}</Text>
          <View style={styles.divider} />
          <Text style={styles.changeText}>—</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  labelText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#880E4F',
  },
});

export default RetailPriceRow;