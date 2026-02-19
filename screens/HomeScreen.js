import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal, FlatList, TextInput, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CurvedHeader from '../components/CurvedHeader';
import RateTable from '../components/RateTable';
import RatesScreen from './RatesScreen';
import AlertsScreen from './AlertsScreen';
import VideoScreen from './VideoScreen';
import AdminScreen from './AdminScreen';
import ScrollingTicker from '../components/ScrollingTicker';
import { fetchRates } from '../services/api';



const HomeScreen = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [modalVisible, setModalVisible] = useState(null); // 'call', 'search', 'notify'
  const [showAdminScreen, setShowAdminScreen] = useState(false);
  const insets = useSafeAreaInsets();

  const [videos, setVideos] = useState([
    { id: '1', videoId: 'dQw4w9WgXcQ', title: 'Abhinav Gold & Silver - Quality Purity' },
  ]);

  const [tickerMessage, setTickerMessage] = useState('Welcome to Abhinav Gold & Silver - Quality Purity Guaranteed');


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


  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );



  useEffect(() => {
    let isMounted = true;
    const loadRates = async () => {
      if (!autoUpdate) return; // Skip if in manual mode
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
  }, [autoUpdate]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#880E4F" />
      </View>
    );
  }

  if (showAdminScreen) {
    return (
      <AdminScreen
        onClose={() => setShowAdminScreen(false)}
        videos={videos}
        onUpdateVideos={(updatedVideos) => {
          setVideos(updatedVideos);
          setShowAdminScreen(false);
        }}
        rates={rates}
        onUpdateRates={(newRates) => {
          setRates(newRates);
          setAutoUpdate(false); // Disable auto-update when manual rates are set
          Alert.alert('Success', 'Rates updated successfully! Auto-refresh disabled.');
          setShowAdminScreen(false);
        }}
        toggleAutoUpdate={() => {
          setAutoUpdate(true);
          Alert.alert('Success', 'Auto-refresh enabled!');
        }}
        isAutoUpdate={autoUpdate}
        tickerMessage={tickerMessage}
        onUpdateTickerMessage={(message) => {
          setTickerMessage(message);
          Alert.alert('Success', 'Ticker message updated successfully!');
        }}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Animated.ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100, paddingTop: 350 + insets.top }]}
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

      case 'rates':
        return <RatesScreen onScroll={onScroll} headerHeight={330 + insets.top} />;
      case 'alerts':
        return <AlertsScreen onScroll={onScroll} headerHeight={330 + insets.top} />;
      case 'videos':
        return <VideoScreen onScroll={onScroll} headerHeight={330 + insets.top} videoData={videos} />;
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
        onAdmin={() => setShowAdminScreen(true)}
        showAdmin={activeTab === 'videos'}
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
              <TouchableOpacity activeOpacity={1}>
                {renderModalContent()}
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalVisible(null)}
                >
                  <Text style={styles.closeBtnTxt}>Close</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Global Scrolling Ticker */}
      <ScrollingTicker rates={rates} tickerMessage={tickerMessage} />

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
            color={activeTab === 'alerts' ? '#8B004B' : '#999'}
          />
          <Text style={activeTab === 'alerts' ? styles.tabLabelActive : styles.tabLabel}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'videos' && styles.tabItemActive]}
          onPress={() => setActiveTab('videos')}
        >
          <Ionicons
            name={activeTab === 'videos' ? 'play-circle' : 'play-circle-outline'}
            size={24}
            color={activeTab === 'videos' ? '#8B004B' : '#999'}
          />
          <Text style={activeTab === 'videos' ? styles.tabLabelActive : styles.tabLabel}>Videos</Text>
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
    paddingTop: 0,
    justifyContent: 'space-around',
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
    maxHeight: '80%',
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
  // Admin Styles
  adminInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loginBtn: {
    backgroundColor: '#8B004B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  loginBtnTxt: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  dashboardSection: {
    backgroundColor: '#FFF5F8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  updateBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateBtnTxt: {
    color: '#8B004B',
    fontWeight: '800',
    fontSize: 14,
  },
  videoInputGroup: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  videoIndexLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B004B',
    marginBottom: 5,
  },
  adminInputSmall: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default HomeScreen;
