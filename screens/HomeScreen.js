import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CurvedHeader from '../components/CurvedHeader';
import RateCard from '../components/RateCard';
import RetailPriceRow from '../components/RetailPriceRow';
import NewsScreen from './NewsScreen';
import RatesScreen from './RatesScreen';
import AlertsScreen from './AlertsScreen';
import { fetchRates } from '../services/api';

const HomeScreen = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let isMounted = true;
    const loadRates = async () => {
      try {
        const data = await fetchRates();
        if (isMounted) setRates(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRates();
    const intervalId = setInterval(loadRates, 30 * 1000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
            showsVerticalScrollIndicator={false}
          >
            <RateCard
              title="Gold RTGS"
              icon={require('../assets/divya.png')}
              buyLabel="Buy"
              sellLabel="Sell"
              buyRate={rates?.goldBuy}
              sellRate={rates?.goldSell}
              onPressBuy={() => Alert.alert('Demo', 'Gold Buy Triggered')}
              onPressSell={() => Alert.alert('Demo', 'Gold Sell Triggered')}
            />

            <RateCard
              title="Silver RTGS"
              icon={require('../assets/divya.png')}
              buyLabel="Silver 5K MINIOR"
              sellLabel="Sell"
              buyRate={rates?.silverBuy}
              sellRate={rates?.silverSell}
              extraContent={
                <View style={styles.silverSubtitleRow}>
                  <Text style={styles.silverSubtitle}>30kg only</Text>
                </View>
              }
              onPressBuy={() => Alert.alert('Demo', 'Silver 5K Buy Triggered')}
              onPressSell={() => Alert.alert('Demo', 'Silver Sell Triggered')}
            />

            <View style={styles.retailCard}>
              <View style={styles.retailHeader}>
                <Text style={styles.retailIcon}>📦</Text>
                <Text style={styles.retailTitle}>Retail Price</Text>
              </View>

              <RetailPriceRow
                icon={require('../assets/divya.png')}
                label="1 grm gold"
                price={rates?.retailGold}
              />
              <View style={styles.rowSeparator} />
              <RetailPriceRow
                icon={require('../assets/divya.png')}
                label="10 grm silver"
                price={rates?.retailSilver}
              />
            </View>
          </ScrollView>
        );
      case 'news':
        return <NewsScreen />;
      case 'rates':
        return <RatesScreen />;
      case 'alerts':
        return <AlertsScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <CurvedHeader
        onCall={() => Alert.alert('Demo', 'Contacting Customer Support...')}
        onSearch={() => Alert.alert('Demo', 'Search function activated')}
        onNotify={() => Alert.alert('Demo', 'No new notifications')}
      />

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      <View style={[styles.bottomTab, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Text style={styles.tabEmoji}>🏠</Text>
          <Text style={activeTab === 'home' ? styles.tabLabelActive : styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('news')}>
          <Text style={styles.tabEmoji}>📰</Text>
          <Text style={activeTab === 'news' ? styles.tabLabelActive : styles.tabLabel}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('rates')}>
          <Text style={styles.tabEmoji}>📊</Text>
          <Text style={activeTab === 'rates' ? styles.tabLabelActive : styles.tabLabel}>Rates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('alerts')}>
          <Text style={styles.tabEmoji}>📢</Text>
          <Text style={activeTab === 'alerts' ? styles.tabLabelActive : styles.tabLabel}>Alerts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingTop: 0,
  },
  silverSubtitleRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  silverSubtitle: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  retailCard: {
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
  retailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  retailIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  retailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  rowSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabEmoji: {
    fontSize: 22,
    marginBottom: 5,
  },
  tabLabel: {
    fontSize: 12,
    color: '#999999',
  },
  tabLabelActive: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
  },
});

export default HomeScreen;
