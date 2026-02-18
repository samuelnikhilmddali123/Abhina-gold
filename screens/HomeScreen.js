import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal, FlatList, TextInput, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CurvedHeader from '../components/CurvedHeader';
import RateTable from '../components/RateTable';
import NewsScreen from './NewsScreen';
import RatesScreen from './RatesScreen';
import AlertsScreen from './AlertsScreen';
import { fetchRates } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NEWS_ITEMS = [
  '✨ Gold rates are currently stable with a slight upward trend.',
  '💎 New Bridal Collection launched! Visit our gallery now.',
  '📈 Silver fine prices hit a monthly low - Perfect time to buy!',
  '⌛ Booking timings extended until 8 PM this Saturday.',
  '🏆 Trusted by over 10,000 customers for quality & purity.'
];

const SEAMLESS_NEWS = [...NEWS_ITEMS, ...NEWS_ITEMS]; // Duplicate for seamless looping

const HomeScreen = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [modalVisible, setModalVisible] = useState(null); // 'call', 'search', 'notify'
  const insets = useSafeAreaInsets();

  const MOCK_CONTACTS = [
    { id: '1', name: 'Sales Support', number: '08644-224413', icon: 'call' },
    { id: '2', name: 'WhatsApp Inquiry', number: '+91 98480 12345', icon: 'logo-whatsapp' },
    { id: '3', name: 'Billing Dept', number: '040-1234567', icon: 'business' },
  ];

  const MOCK_NOTIFICATIONS = [
    { id: '1', title: 'Price Alert', body: 'Gold RTGS just hit a weekly low!', time: '2 mins ago' },
    { id: '2', title: 'Market News', body: 'New designs added to Design Collections.', time: '1 hour ago' },
    { id: '3', title: 'Update', body: 'Booking timings extended for Saturday.', time: '3 hours ago' },
  ];

  const MOCK_SEARCHES = ['Bridal Gold', 'Engagement Rings', 'Silver Rate Today', 'Temple Jewellery'];

  const scrollX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  useEffect(() => {
    const singleSetWidth = NEWS_ITEMS.join('        •        ').length * 9;

    const startAnimation = () => {
      scrollX.setValue(0);
      Animated.timing(scrollX, {
        toValue: -singleSetWidth,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startAnimation());
    };

    startAnimation();
  }, [scrollX]);

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
        <ActivityIndicator size="large" color="#880E4F" />
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Animated.ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100, paddingTop: 240 + insets.top }]}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            <RateTable
              title="SPOT"
              columns={['Bid', 'Ask', 'High', 'Low']}
              data={rates?.spot || []}
            />

            <RateTable
              title="PRODUCT"
              columns={['Buy Rate', 'Sell Rate', 'Stock']}
              data={rates?.rtgs || []}
            />

            <View style={styles.sideBySideRow}>
              <View style={{ flex: 1 }}>
                <RateTable
                  title="FUTURES"
                  columns={['Bid', 'Ask']}
                  data={rates?.futures || []}
                />
              </View>
              <View style={{ flex: 1 }}>
                <RateTable
                  title="NEXT"
                  columns={['Bid', 'Ask']}
                  data={rates?.next || []}
                />
              </View>
            </View>

            <View style={styles.bookingCard}>
              <View style={styles.bookingRow}>
                <Text style={styles.bookingEmoji}>⏰</Text>
                <View>
                  <Text style={styles.bookingTitle}>BOOKING TIME</Text>
                  <Text style={styles.bookingDetail}>MON TO FRI: 10 AM TO 10 PM | SAT: 10 AM TO 2:00 PM</Text>
                </View>
              </View>
              <View style={styles.bookingRow}>
                <Text style={styles.bookingEmoji}>📞</Text>
                <View>
                  <Text style={styles.bookingTitle}>BOOKING NUMBER</Text>
                  <Text style={styles.bookingDetail}>08644-224413</Text>
                </View>
              </View>
            </View>
          </Animated.ScrollView>
        );
      case 'news':
        return <NewsScreen onScroll={onScroll} headerHeight={240 + insets.top} />;
      case 'rates':
        return <RatesScreen onScroll={onScroll} headerHeight={240 + insets.top} />;
      case 'alerts':
        return <AlertsScreen onScroll={onScroll} headerHeight={240 + insets.top} />;
      default:
        return null;
    }
  };

  const renderModalContent = () => {
    switch (modalVisible) {
      case 'call':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact Us</Text>
            {MOCK_CONTACTS.map(contact => (
              <TouchableOpacity
                key={contact.id}
                style={styles.modalItem}
                onPress={() => Alert.alert('Calling', `Dialing ${contact.number}...`)}
              >
                <Ionicons name={contact.icon} size={24} color="#880E4F" style={{ marginRight: 15 }} />
                <View>
                  <Text style={styles.itemTitle}>{contact.name}</Text>
                  <Text style={styles.itemSubtitle}>{contact.number}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'search':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
              <TextInput placeholder="Search designs..." style={{ flex: 1 }} />
            </View>
            <Text style={styles.subHeader}>Recent Searches</Text>
            {MOCK_SEARCHES.map((search, idx) => (
              <TouchableOpacity key={idx} style={styles.searchItem} onPress={() => Alert.alert('Search', `Searching for ${search}...`)}>
                <Ionicons name="time-outline" size={18} color="#999" style={{ marginRight: 10 }} />
                <Text style={styles.searchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'notify':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {MOCK_NOTIFICATIONS.map(note => (
              <View key={note.id} style={styles.modalItem}>
                <View style={styles.notificationDot} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.itemTitle}>{note.title}</Text>
                    <Text style={styles.timeTxt}>{note.time}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{note.body}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <CurvedHeader
        scrollY={scrollY}
        onCall={() => setModalVisible('call')}
        onSearch={() => setModalVisible('search')}
        onNotify={() => setModalVisible('notify')}
        rates={rates}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible !== null}
        onRequestClose={() => setModalVisible(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(null)}
        >
          <View style={styles.modalWrapper}>
            {renderModalContent()}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(null)}
            >
              <Text style={styles.closeBtnTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* News Ticker Bar */}
      <View style={styles.tickerContainer}>
        <Animated.View style={[styles.tickerWrapper, { transform: [{ translateX: scrollX }] }]}>
          <Text style={styles.tickerText}>
            {SEAMLESS_NEWS.join('        •        ')}
          </Text>
        </Animated.View>
      </View>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 15) }]}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'home' && styles.tabItemActive]}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'home' ? '#880E4F' : '#999'}
          />
          <Text style={activeTab === 'home' ? styles.tabLabelActive : styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'news' && styles.tabItemActive]}
          onPress={() => setActiveTab('news')}
        >
          <Ionicons
            name={activeTab === 'news' ? 'newspaper' : 'newspaper-outline'}
            size={24}
            color={activeTab === 'news' ? '#880E4F' : '#999'}
          />
          <Text style={activeTab === 'news' ? styles.tabLabelActive : styles.tabLabel}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'rates' && styles.tabItemActive]}
          onPress={() => setActiveTab('rates')}
        >
          <Ionicons
            name={activeTab === 'rates' ? 'bar-chart' : 'bar-chart-outline'}
            size={24}
            color={activeTab === 'rates' ? '#880E4F' : '#999'}
          />
          <Text style={activeTab === 'rates' ? styles.tabLabelActive : styles.tabLabel}>Rates</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'alerts' && styles.tabItemActive]}
          onPress={() => setActiveTab('alerts')}
        >
          <Ionicons
            name={activeTab === 'alerts' ? 'notifications' : 'notifications-outline'}
            size={24}
            color={activeTab === 'alerts' ? '#880E4F' : '#999'}
          />
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
  },
  scrollContent: {
    paddingTop: 0,
  },
  sideBySideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingCard: {
    backgroundColor: '#880E4F',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingEmoji: {
    fontSize: 24,
    marginRight: 15,
    color: '#FFD700',
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
  },
  bookingDetail: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: '#FDF2F8',
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
    color: '#880E4F',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 20,
  },
  modalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#880E4F',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#880E4F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnTxt: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#999',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  searchText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#880E4F',
    marginRight: 15,
  },
  timeTxt: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  // Ticker Styles
  tickerContainer: {
    height: 35,
    backgroundColor: '#880E4F',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.3)', // Subtle gold border
  },
  tickerWrapper: {
    flexDirection: 'row',
    width: 5000, // Force a very large width to prevent text wrapping
  },
  tickerText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '800', // Bolder for better visibility
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
