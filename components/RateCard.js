import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from '../themes/colors';

const RateCard = ({
  title,
  subtitle,
  buyLabel,
  sellLabel,
  buyRate,
  sellRate,
  onPressBuy,
  onPressSell,
  extraContent,
  icon,
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Card header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          {icon && <Image source={icon} style={styles.headerIcon} resizeMode="contain" />}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Small indicator icon/text from image */}
          <Text style={styles.indicatorText}>📊</Text>
        </View>
      </View>

      {/* Main rate columns */}
      <View style={styles.columnsContainer}>
        <View style={styles.rateColumn}>
          <Text style={styles.columnLabel}>{buyLabel}</Text>
          <Text style={styles.rateText}>{buyRate?.toLocaleString()}</Text>
          <TouchableOpacity style={styles.buyButton} onPress={onPressBuy}>
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.rateColumn}>
          <Text style={styles.columnLabel}>{sellLabel}</Text>
          <Text style={styles.rateText}>{sellRate?.toLocaleString()}</Text>
          <TouchableOpacity style={styles.sellButton} onPress={onPressSell}>
            <Text style={styles.buttonText}>Sell</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional extra content (e.g., Silver 5K Minior row) */}
      {extraContent && <View style={styles.extraContent}>{extraContent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  indicatorText: {
    fontSize: 14,
    color: '#999999',
  },
  columnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#EEEEEE',
    marginHorizontal: 10,
  },
  columnLabel: {
    fontSize: 14,
    color: '#880E4F',
    fontWeight: '500',
    marginBottom: 5,
  },
  rateText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#880E4F',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#880E4F',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  sellButton: {
    backgroundColor: '#880E4F',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  extraContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default RateCard;