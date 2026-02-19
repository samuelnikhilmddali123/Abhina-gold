import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScrollingTicker from '../components/ScrollingTicker';

const AdminScreen = ({ onClose, videos, onUpdateVideos, rates, onUpdateRates, toggleAutoUpdate, isAutoUpdate, tickerMessage, onUpdateTickerMessage }) => {
    const insets = useSafeAreaInsets();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Login State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [storedPassword, setStoredPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);

    // Tabs State
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'news', 'profile'

    // Rate App Logic State
    const [tempRates, setTempRates] = useState(null);
    const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState('increase'); // 'increase' or 'decrease'
    const [adjustmentScope, setAdjustmentScope] = useState('all'); // 'all', 'gold', 'silver'
    const [adjustmentAmount, setAdjustmentAmount] = useState('');

    // Video Logic State
    const [tempVideos, setTempVideos] = useState([]);

    // Profile Logic State (Password)
    const [newPassword, setNewPassword] = useState('');

    // Ticker Message Logic State
    const [tempTickerMessage, setTempTickerMessage] = useState('');

    // Initialize logic
    useEffect(() => {
        if (videos) {
            setTempVideos(videos.map(v => ({ ...v })));
        }
        if (rates) {
            setTempRates(JSON.parse(JSON.stringify(rates)));
        }
        if (tickerMessage !== undefined) {
            setTempTickerMessage(tickerMessage);
        }
    }, [videos, rates, tickerMessage]);

    const handleLogin = () => {
        if (username === 'admin' && password === storedPassword) {
            setIsLoggedIn(true);
            setPassword('');
        } else {
            Alert.alert('Error', 'Invalid credentials');
        }
    };

    // --- Rate Adjustment Logic ---
    const openAdjustmentModal = (type) => {
        setAdjustmentType(type);
        setAdjustmentAmount('');
        setAdjustmentScope('all');
        setAdjustmentModalVisible(true);
    };

    const applyRateAdjustment = () => {
        const amount = parseFloat(adjustmentAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Error', 'Please enter a valid positive amount.');
            return;
        }

        const newRates = JSON.parse(JSON.stringify(tempRates));
        const isIncrease = adjustmentType === 'increase';
        const factor = isIncrease ? 1 : -1;
        const delta = amount * factor;

        // Helper to check scope
        const shouldAdjust = (name) => {
            const n = name.toUpperCase();
            if (adjustmentScope === 'all') return true;
            if (adjustmentScope === 'gold' && n.includes('GOLD')) return true;
            if (adjustmentScope === 'silver' && n.includes('SILVER')) return true;
            return false;
        };

        // Adjust Spot Rates
        newRates.spot.forEach(item => {
            if (shouldAdjust(item.name)) {
                item.bid = parseFloat((item.bid + delta).toFixed(2));
                item.ask = parseFloat((item.ask + delta).toFixed(2));
                item.high = parseFloat((item.high + delta).toFixed(2));
                item.low = parseFloat((item.low + delta).toFixed(2));
            }
        });

        // Adjust Product Rates
        newRates.rtgs.forEach(item => {
            if (shouldAdjust(item.name)) {
                if (item.sell !== '-' && typeof item.sell === 'number') {
                    item.sell = parseFloat((item.sell + delta).toFixed(2));
                }
            }
        });

        setTempRates(newRates);
        setAdjustmentModalVisible(false);
        Alert.alert('Adjusted', `Rates ${isIncrease ? 'increased' : 'decreased'} by ₹${amount}. Click "Show Adjusted" / "Update" to apply to home.`);
    };

    // --- Tab Content Renderers ---

    const renderUsersTab = () => (
        <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Rate Adjustment Card */}
            <View style={styles.card}>
                <Text style={styles.cardHeader}>Rate Adjustment</Text>
                <Text style={styles.cardSubtext}>
                    Adjust silver/gold rates. Enter positive amount to increase or decrease rates.
                </Text>
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#D32F2F' }]}
                        onPress={() => openAdjustmentModal('decrease')}
                    >
                        <Text style={styles.actionBtnTxt}>- Decrease Rates</Text>
                    </TouchableOpacity>
                    <View style={{ width: 15 }} />
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#388E3C' }]}
                        onPress={() => openAdjustmentModal('increase')}
                    >
                        <Text style={styles.actionBtnTxt}>+ Increase Rates</Text>
                    </TouchableOpacity>
                </View>

                {/* Auto Toggle in Card */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 }}>
                    <Text style={{ color: '#666', fontWeight: 'bold' }}>Live Auto-Update</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isAutoUpdate ? "#f5dd4b" : "#f4f3f4"}
                        onValueChange={toggleAutoUpdate}
                        value={isAutoUpdate}
                    />
                </View>
            </View>

            {/* Current Metal Rates Card */}
            <View style={styles.card}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.cardHeader}>Current Metal Rates •</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.showAdjustedBtn}
                            onPress={() => onUpdateRates(tempRates)}
                        >
                            <Text style={styles.showAdjustedBtnTxt}>Update Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setTempRates(JSON.parse(JSON.stringify(rates)))}>
                            <Text style={styles.refreshLink}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {tempRates ? (
                    <View style={styles.rateTable}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeader, { flex: 2 }]}>Symbol</Text>
                            <Text style={[styles.tableHeader, { flex: 1, textAlign: 'right' }]}>Bid</Text>
                            <Text style={[styles.tableHeader, { flex: 1, textAlign: 'right' }]}>Ask</Text>
                        </View>
                        {tempRates.spot.map((item) => (
                            <View key={item.id} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>{item.name}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{item.bid}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{item.ask}</Text>
                            </View>
                        ))}
                        <View style={[styles.tableRow, { marginTop: 10 }]}>
                            <Text style={[styles.tableHeader, { flex: 2 }]}>Product</Text>
                            <Text style={[styles.tableHeader, { flex: 1, textAlign: 'right' }]}>Sell</Text>
                        </View>
                        {tempRates.rtgs.map((item) => (
                            <View key={item.id} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 2, fontSize: 13 }]}>{item.name}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{item.sell}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={{ textAlign: 'center', padding: 20, color: '#999' }}>No rates available</Text>
                )}
            </View>
        </ScrollView>
    );

    const renderNewsTab = () => (
        <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.card}>
                <Text style={styles.cardHeader}>Manage Video Links</Text>
                <Text style={styles.cardSubtext}>Add or remove YouTube videos displayed in the app.</Text>

                {tempVideos.map((v, idx) => (
                    <View key={idx} style={styles.videoItem}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <Text style={styles.label}>Video {idx + 1}</Text>
                            <TouchableOpacity onPress={() => {
                                const newTemp = tempVideos.filter((_, i) => i !== idx);
                                setTempVideos(newTemp);
                            }}>
                                <Ionicons name="trash-outline" size={18} color="#D32F2F" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Video ID"
                            value={v.videoId}
                            onChangeText={(text) => {
                                const newTemp = [...tempVideos];
                                newTemp[idx].videoId = text;
                                setTempVideos(newTemp);
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={v.title}
                            onChangeText={(text) => {
                                const newTemp = [...tempVideos];
                                newTemp[idx].title = text;
                                setTempVideos(newTemp);
                            }}
                        />
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.dashedBtn}
                    onPress={() => setTempVideos([...tempVideos, { videoId: '', title: '' }])}
                >
                    <Text style={{ color: '#666' }}>+ Add Another Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.primaryBtn, { marginTop: 15 }]}
                    onPress={() => {
                        const updatedVideos = tempVideos.map((v, i) => ({ ...v, id: (i + 1).toString() }));
                        onUpdateVideos(updatedVideos);
                        Alert.alert('Saved', 'Video list updated.');
                    }}
                >
                    <Text style={styles.primaryBtnTxt}>Update Videos</Text>
                </TouchableOpacity>

                <View style={[styles.card, { marginTop: 30, padding: 0, borderWidth: 0 }]}>
                    <Text style={styles.cardHeader}>Scrolling Ticker Message</Text>
                    <Text style={styles.cardSubtext}>This message will scroll at the bottom of the home screen.</Text>
                    <TextInput
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                        placeholder="Enter scrolling message..."
                        value={tempTickerMessage}
                        onChangeText={setTempTickerMessage}
                        multiline
                    />
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => onUpdateTickerMessage(tempTickerMessage)}
                    >
                        <Text style={styles.primaryBtnTxt}>Update Ticker Message</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );

    const renderProfileTab = () => (
        <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.card}>
                <Text style={styles.cardHeader}>Security</Text>
                <Text style={styles.label}>Change Admin Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                        if (newPassword.length >= 4) {
                            setStoredPassword(newPassword);
                            setNewPassword('');
                            Alert.alert('Success', 'Password changed successfully!');
                        } else {
                            Alert.alert('Error', 'Password must be at least 4 characters');
                        }
                    }}
                >
                    <Text style={styles.secondaryBtnTxt}>Update Password</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[styles.card, { alignItems: 'center', backgroundColor: '#FFEBEE' }]}
                onPress={() => setIsLoggedIn(false)}
            >
                <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    // --- Main Render ---

    if (!isLoggedIn) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.loginContainer}>
                    {/* Back Arrow */}
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.signInTitle}>Sign In</Text>

                    {/* Username Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputField}
                            placeholder="Username/Email Id"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputField}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgotten Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>

                </View>
                {/* Global Ticker on Login Page */}
                <ScrollingTicker rates={rates} tickerMessage={tickerMessage} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    <TouchableOpacity onPress={() => setIsLoggedIn(false)} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={20} color="#FFF" />
                        <Text style={styles.logoutTxt}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.backLink} onPress={onClose}>
                    <Ionicons name="arrow-back" size={16} color="#666" />
                    <Text style={{ marginLeft: 5, color: '#666' }}>Back to App</Text>
                </TouchableOpacity>

                {/* Tabs */}
                <View style={styles.tabBar}>
                    {['Users', 'News', 'Profile'].map((tab) => {
                        const key = tab.toLowerCase(); // 'users', 'news', 'profile' (mapped to profile/store logic)
                        if (tab === 'Profile') key === 'profile'; // Keep simple logic
                        const isActive = activeTab === key;
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabItem, isActive && styles.tabItemActive]}
                                onPress={() => setActiveTab(key)}
                            >
                                <Ionicons
                                    name={tab === 'Users' ? 'people' : tab === 'News' ? 'newspaper' : 'storefront'}
                                    size={18}
                                    color={isActive ? '#1976D2' : '#666'}
                                />
                                <Text style={[styles.tabTxt, isActive && styles.tabTxtActive]}>{tab === 'Profile' ? 'Profile/Store' : tab}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Content */}
                <View style={styles.contentArea}>
                    {activeTab === 'users' && renderUsersTab()}
                    {activeTab === 'news' && renderNewsTab()}
                    {activeTab === 'profile' && renderProfileTab()}
                </View>

                {/* Global Ticker on Dashboard */}
                <ScrollingTicker rates={rates} tickerMessage={tickerMessage} />

                {/* Adjustment Modal */}
                <Modal
                    visible={adjustmentModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setAdjustmentModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{adjustmentType === 'increase' ? 'Increase Rates' : 'Decrease Rates'}</Text>
                            <Text style={styles.modalSubtitle}>
                                Choose adjustment type and enter value to {adjustmentType}. Example: Enter 100 to {adjustmentType} by ₹100/gram.
                            </Text>

                            <Text style={styles.label}>Select Item</Text>
                            <View style={styles.scopeContainer}>
                                {['all', 'gold', 'silver'].map(scope => (
                                    <TouchableOpacity
                                        key={scope}
                                        style={[styles.scopeBtn, adjustmentScope === scope && styles.scopeBtnActive]}
                                        onPress={() => setAdjustmentScope(scope)}
                                    >
                                        <Text style={[styles.scopeBtnTxt, adjustmentScope === scope && styles.scopeBtnTxtActive]}>
                                            {scope === 'all' ? 'All Items' : scope === 'gold' ? 'All Gold Items' : 'All Silver Items'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.label}>Amount (₹)</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Amount to adjust"
                                keyboardType="numeric"
                                value={adjustmentAmount}
                                onChangeText={setAdjustmentAmount}
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity onPress={() => setAdjustmentModalVisible(false)}>
                                    <Text style={styles.cancelBtnTxt}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.applyBtn, { backgroundColor: adjustmentType === 'increase' ? '#388E3C' : '#D32F2F' }]}
                                    onPress={applyRateAdjustment}
                                >
                                    <Text style={styles.applyBtnTxt}>{adjustmentType === 'increase' ? 'Increase' : 'Decrease'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loginCard: {
        margin: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: '#D32F2F',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutTxt: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    backLink: {
        padding: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Tabs
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginRight: 25,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabItemActive: {
        borderBottomColor: '#1976D2',
    },
    tabTxt: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        fontWeight: '500',
    },
    tabTxtActive: {
        color: '#1976D2',
        fontWeight: 'bold',
    },
    contentArea: {
        flex: 1,
        padding: 15,
    },
    tabContent: {
        flex: 1,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cardHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    cardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardSubtext: {
        fontSize: 12,
        color: '#777',
        marginBottom: 20,
    },
    actionRow: {
        flexDirection: 'row',
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    actionBtnTxt: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    showAdjustedBtn: {
        backgroundColor: '#FFA000',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginRight: 15,
    },
    showAdjustedBtnTxt: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    refreshLink: {
        color: '#1976D2',
        fontSize: 12,
    },
    // Tables
    rateTable: {
        marginTop: 5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    tableHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
    },
    tableCell: {
        fontSize: 14,
        color: '#333',
    },
    // Video / Form
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#FAFAFA',
    },
    videoItem: {
        backgroundColor: '#FAFAFA',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    dashedBtn: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderStyle: 'dashed',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    primaryBtn: {
        backgroundColor: '#1976D2',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    primaryBtnTxt: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    secondaryBtn: {
        backgroundColor: '#FFA000',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    secondaryBtnTxt: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    scopeContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#1976D2',
        borderRadius: 5,
        overflow: 'hidden',
    },
    scopeBtn: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    scopeBtnActive: {
        backgroundColor: '#E3F2FD',
    },
    scopeBtnTxt: {
        color: '#333',
    },
    scopeBtnTxtActive: {
        color: '#1976D2',
        fontWeight: 'bold',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    cancelBtnTxt: {
        color: '#666',
        marginRight: 20,
        fontWeight: '600',
    },
    applyBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    applyBtnTxt: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    // New Login Styles
    loginContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    signInTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        backgroundColor: '#FAFAFA',
    },
    inputIcon: {
        marginRight: 10,
    },
    inputField: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: '#1976D2',
        fontWeight: '600',
    },
    signInButton: {
        backgroundColor: '#1976D2',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    signInButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AdminScreen;
