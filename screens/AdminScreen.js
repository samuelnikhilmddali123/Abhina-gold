import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, Alert, Modal, Switch, KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScrollingTicker from '../components/ScrollingTicker';

// ─── Helper ──────────────────────────────────────────────────────────────────
/**
 * Get the USD-INR exchange rate (ask) from liveRates.
 */
const getUsdInrRate = (liveRates) => {
    if (!liveRates?.spot) return null;
    const usdRow = liveRates.spot.find(
        (s) => (s.name || '').toUpperCase().includes('USD')
    );
    return usdRow ? (usdRow.ask ?? usdRow.bid) : null;
};

/**
 * Get a product rate from RTGS list by metal keyword (GOLD/SILVER).
 * RTGS rates are already in INR — these match the home page product section.
 */
const getRtgsMetalRate = (liveRates, metal) => {
    if (!liveRates?.rtgs) return null;
    return liveRates.rtgs.find(
        (r) => (r.name || '').toUpperCase().includes(metal.toUpperCase())
    ) || null;
};

/**
 * Compute the preview value after applying the adjustment.
 */
const computePreview = (baseValue, mode, rawValue) => {
    if (typeof baseValue !== 'number') return '-';
    const val = parseFloat(rawValue);
    if (isNaN(val)) return baseValue.toFixed(2);
    if (mode === 'amount') return (baseValue + val).toFixed(2);
    if (mode === 'percent') return (baseValue + (baseValue * val) / 100).toFixed(2);
    return baseValue.toFixed(2);
};

// ─── Sub-component: one category row ─────────────────────────────────────────
const AdjustmentRow = ({ label, liveRate, adjustment, onChange }) => {
    const [inputValue, setInputValue] = useState(
        adjustment.value !== 0 ? String(adjustment.value) : '0'
    );
    const [mode, setMode] = useState(adjustment.mode); // 'amount' | 'percent'

    // RTGS items have 'sell', not 'bid'
    const baseVal = liveRate?.sell ?? liveRate?.bid ?? null;

    const currentNum = parseFloat(inputValue) || 0;
    const step = mode === 'percent' ? 0.5 : 1;

    const preview = computePreview(baseVal, mode, String(currentNum));

    const applyAndSave = (newVal) => {
        const rounded = parseFloat(newVal.toFixed(2));
        setInputValue(String(rounded));
        onChange({ mode, value: rounded });
    };

    const handleDecrease = () => applyAndSave(currentNum - step);
    const handleIncrease = () => applyAndSave(currentNum + step);

    const handleManualSave = () => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) {
            Alert.alert('Error', 'Please enter a valid number.');
            return;
        }
        onChange({ mode, value: val });
    };

    return (
        <View style={rowStyles.container}>
            {/* Header: label + live sell */}
            <View style={rowStyles.header}>
                <View style={rowStyles.labelBadge}>
                    <Text style={rowStyles.labelText}>{label}</Text>
                </View>
                {liveRate && (
                    <Text style={rowStyles.liveBid}>
                        Live Sell: <Text style={rowStyles.liveBidVal}>
                            ₹{typeof baseVal === 'number' ? baseVal.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '-'}
                        </Text>
                    </Text>
                )}
            </View>

            {/* Mode toggle */}
            <View style={rowStyles.modeRow}>
                <TouchableOpacity
                    style={[rowStyles.modeBtn, mode === 'amount' && rowStyles.modeBtnActive]}
                    onPress={() => setMode('amount')}
                >
                    <Text style={[rowStyles.modeBtnTxt, mode === 'amount' && rowStyles.modeBtnTxtActive]}>
                        ₹ Amount
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[rowStyles.modeBtn, mode === 'percent' && rowStyles.modeBtnActive]}
                    onPress={() => setMode('percent')}
                >
                    <Text style={[rowStyles.modeBtnTxt, mode === 'percent' && rowStyles.modeBtnTxtActive]}>
                        % Percent
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Stepper row ── */}
            <View style={rowStyles.stepperRow}>
                {/* Decrease button */}
                <TouchableOpacity style={rowStyles.stepBtn} onPress={handleDecrease}>
                    <Text style={rowStyles.stepBtnTxt}>−</Text>
                </TouchableOpacity>

                {/* Value display / manual input */}
                <TextInput
                    style={rowStyles.stepInput}
                    keyboardType="numeric"
                    value={inputValue}
                    onChangeText={setInputValue}
                    onBlur={handleManualSave}
                    textAlign="center"
                />

                {/* Increase button */}
                <TouchableOpacity style={[rowStyles.stepBtn, rowStyles.stepBtnIncrease]} onPress={handleIncrease}>
                    <Text style={rowStyles.stepBtnTxt}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Step hint + preview */}
            <View style={rowStyles.previewRowFull}>
                <Text style={rowStyles.stepHint}>
                    Step: {step}{mode === 'percent' ? '%' : ''} &nbsp;|&nbsp; Tap buttons to adjust instantly
                </Text>
                <View style={rowStyles.previewBox}>
                    <Text style={rowStyles.previewLabel}>Preview</Text>
                    <Text style={rowStyles.previewValue}>
                        ₹{typeof baseVal === 'number'
                            ? computePreview(baseVal, mode, String(currentNum))
                            : '-'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const rowStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        padding: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    labelBadge: {
        backgroundColor: '#880E4F',
        borderRadius: 4,
        paddingVertical: 3,
        paddingHorizontal: 10,
    },
    labelText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
    liveBid: {
        fontSize: 12,
        color: '#666',
    },
    liveBidVal: {
        color: '#1B5E20',
        fontWeight: 'bold',
    },
    modeRow: {
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1976D2',
    },
    modeBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    modeBtnActive: {
        backgroundColor: '#1976D2',
    },
    modeBtnTxt: {
        color: '#1976D2',
        fontWeight: '600',
        fontSize: 13,
    },
    modeBtnTxtActive: {
        color: '#FFF',
    },

    // Stepper row
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    stepBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#D32F2F',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    stepBtnIncrease: {
        backgroundColor: '#388E3C',
    },
    stepBtnTxt: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: 'bold',
        lineHeight: 30,
    },
    stepInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: '#FFF',
        textAlign: 'center',
        height: 52,
    },
    previewRowFull: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    stepHint: {
        fontSize: 11,
        color: '#999',
        flex: 1,
        marginRight: 8,
    },

    // Legacy (kept to avoid import errors)
    inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    input: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 6, padding: 9, fontSize: 15, backgroundColor: '#FFF' },
    previewBox: {
        backgroundColor: '#E8F5E9',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        minWidth: 90,
    },
    previewLabel: {
        fontSize: 10,
        color: '#388E3C',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    previewValue: {
        fontSize: 15,
        color: '#1B5E20',
        fontWeight: 'bold',
    },
    saveBtn: {
        backgroundColor: '#388E3C',
        borderRadius: 6,
        paddingVertical: 9,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveBtnTxt: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

// ─── Main AdminScreen ─────────────────────────────────────────────────────────
const AdminScreen = ({
    onClose,
    videos,
    onUpdateVideos,
    liveRates,          // raw live rates (always updating)
    rateAdjustments,    // { gold: {mode, value}, silver: {mode, value} }
    onSaveAdjustments,  // (newAdj) => void
    showModified,       // boolean
    onShowLive,         // () => void
    onShowModified,     // () => void
    // legacy / compat
    rates,
    onUpdateRates,
    toggleAutoUpdate,
    isAutoUpdate,
    tickerMessage,
    onUpdateTickerMessage,
}) => {
    const insets = useSafeAreaInsets();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Login State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [storedPassword, setStoredPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);

    // Tabs State
    const [activeTab, setActiveTab] = useState('rates'); // default to rates tab

    // Local copy of adjustments (edited here, saved via onSaveAdjustments)
    const [localAdj, setLocalAdj] = useState(
        rateAdjustments || { gold: { mode: 'amount', value: 0 }, silver: { mode: 'amount', value: 0 } }
    );

    // Video tab state
    const [tempVideos, setTempVideos] = useState([]);
    const [newPassword, setNewPassword] = useState('');
    const [tempTickerMessage, setTempTickerMessage] = useState('');

    useEffect(() => {
        if (videos) setTempVideos(videos.map(v => ({ ...v })));
        if (tickerMessage !== undefined) setTempTickerMessage(tickerMessage);
    }, [videos, tickerMessage]);

    useEffect(() => {
        if (rateAdjustments) setLocalAdj(rateAdjustments);
    }, [rateAdjustments]);

    const handleLogin = () => {
        if (username === 'admin' && password === storedPassword) {
            setIsLoggedIn(true);
            setPassword('');
        } else {
            Alert.alert('Error', 'Invalid credentials');
        }
    };

    // ── Rates Tab ───────────────────────────────────────────────────────────────
    const renderRatesTab = () => {
        // RTGS rates are already in INR — same as home page product section
        const goldRtgs = getRtgsMetalRate(liveRates, 'GOLD');
        const silverRtgs = getRtgsMetalRate(liveRates, 'SILVER');
        const usdInr = getUsdInrRate(liveRates);

        return (
            <ScrollView
                style={styles.tabContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Live Rates Display ─────────────────────────────── */}
                <View style={styles.card}>
                    <View style={styles.cardTitleRow}>
                        <Text style={styles.cardHeader}>📡 Live Rates (₹ INR)</Text>
                        <View style={styles.liveDot}>
                            <View style={styles.liveDotCircle} />
                            <Text style={styles.liveDotTxt}>LIVE</Text>
                        </View>
                    </View>

                    {/* All RTGS products — exactly what home page shows */}
                    {liveRates?.rtgs?.length > 0 ? (
                        liveRates.rtgs.map((item) => (
                            <View key={item.id} style={styles.liveProductRow}>
                                <Text style={styles.liveProductName}>{item.name}</Text>
                                <View style={styles.liveProductVals}>
                                    <View style={styles.liveProductValBox}>
                                        <Text style={styles.liveProductValLabel}>SELL</Text>
                                        <Text style={styles.liveProductVal}>
                                            ₹{typeof item.sell === 'number' ? item.sell.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : item.sell}
                                        </Text>
                                    </View>
                                    {item.buy !== '-' && (
                                        <View style={styles.liveProductValBox}>
                                            <Text style={styles.liveProductValLabel}>BUY</Text>
                                            <Text style={[styles.liveProductVal, { color: '#1976D2' }]}>
                                                ₹{typeof item.buy === 'number' ? item.buy.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : item.buy}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ color: '#999', textAlign: 'center', padding: 10 }}>Loading rates...</Text>
                    )}

                    {/* Reference: USD-INR rate */}
                    {usdInr && (
                        <View style={[styles.liveProductRow, { marginTop: 6, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 }]}>
                            <Text style={[styles.liveProductName, { color: '#999' }]}>USD-INR Rate</Text>
                            <Text style={[styles.liveProductVal, { color: '#999' }]}>₹{usdInr.toFixed(2)} / $1</Text>
                        </View>
                    )}
                </View>

                {/* ── Show Live / Show Modified Toggle ───────────────── */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>🏠 Home Page Display</Text>
                    <Text style={styles.cardSubtext}>
                        Choose whether the home page shows raw live rates or live rates + your adjustments.
                    </Text>
                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={[styles.toggleBtn, !showModified && styles.toggleBtnActive]}
                            onPress={onShowLive}
                        >
                            <Ionicons
                                name="wifi"
                                size={18}
                                color={!showModified ? '#FFF' : '#1976D2'}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.toggleBtnTxt, !showModified && styles.toggleBtnTxtActive]}>
                                Show Live
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.toggleBtn, showModified && styles.toggleBtnModifiedActive]}
                            onPress={onShowModified}
                        >
                            <Ionicons
                                name="create"
                                size={18}
                                color={showModified ? '#FFF' : '#F57F17'}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.toggleBtnTxt, showModified && styles.toggleBtnTxtActive]}>
                                Show Modified
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.toggleStatusTxt}>
                        {showModified
                            ? '✏️ Displaying: Live rates + your adjustments'
                            : '📡 Displaying: Raw live rates'}
                    </Text>
                </View>

                {/* ── Adjustment Controls ────────────────────────────── */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>⚙️ Rate Adjustments</Text>
                    <Text style={styles.cardSubtext}>
                        Set an offset per category. Enter a positive number to increase, negative to decrease.
                        Changes auto-track live rate movements.
                    </Text>

                    <AdjustmentRow
                        label="GOLD"
                        liveRate={goldRtgs}
                        adjustment={localAdj.gold}
                        onChange={(newAdj) => {
                            const updated = { ...localAdj, gold: newAdj };
                            setLocalAdj(updated);
                            onSaveAdjustments(updated);
                        }}
                    />

                    <AdjustmentRow
                        label="SILVER"
                        liveRate={silverRtgs}
                        adjustment={localAdj.silver}
                        onChange={(newAdj) => {
                            const updated = { ...localAdj, silver: newAdj };
                            setLocalAdj(updated);
                            onSaveAdjustments(updated);
                        }}
                    />

                    {/* Quick Reset */}
                    <TouchableOpacity
                        style={styles.resetBtn}
                        onPress={() => {
                            const zero = { gold: { mode: 'amount', value: 0 }, silver: { mode: 'amount', value: 0 } };
                            setLocalAdj(zero);
                            onSaveAdjustments(zero);
                            Alert.alert('Reset', 'All adjustments cleared.');
                        }}
                    >
                        <Ionicons name="refresh-circle-outline" size={16} color="#D32F2F" style={{ marginRight: 5 }} />
                        <Text style={styles.resetBtnTxt}>Reset All Adjustments to Zero</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Auto-Update Toggle ─────────────────────────────── */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.cardHeader}>Live Auto-Update</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isAutoUpdate ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={toggleAutoUpdate}
                            value={isAutoUpdate}
                        />
                    </View>
                    <Text style={styles.cardSubtext}>
                        {isAutoUpdate
                            ? 'Rates refresh from server every second.'
                            : 'Auto-refresh is OFF.'}
                    </Text>
                </View>
            </ScrollView>
        );
    };

    // ── News Tab (unchanged) ────────────────────────────────────────────────────
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

    // ── Profile Tab (unchanged) ─────────────────────────────────────────────────
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

    // ── Login Screen ────────────────────────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.loginContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.signInTitle}>Sign In</Text>

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
                            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
                <ScrollingTicker rates={rates} tickerMessage={tickerMessage} />
            </View>
        );
    }

    // ── Dashboard ────────────────────────────────────────────────────────────────
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
                    {[
                        { key: 'rates', label: 'Rates', icon: 'trending-up' },
                        { key: 'news', label: 'News', icon: 'newspaper' },
                        { key: 'profile', label: 'Profile', icon: 'storefront' },
                    ].map(({ key, label, icon }) => {
                        const isActive = activeTab === key;
                        return (
                            <TouchableOpacity
                                key={key}
                                style={[styles.tabItem, isActive && styles.tabItemActive]}
                                onPress={() => setActiveTab(key)}
                            >
                                <Ionicons name={icon} size={18} color={isActive ? '#1976D2' : '#666'} />
                                <Text style={[styles.tabTxt, isActive && styles.tabTxtActive]}>{label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Content */}
                <View style={styles.contentArea}>
                    {activeTab === 'rates' && renderRatesTab()}
                    {activeTab === 'news' && renderNewsTab()}
                    {activeTab === 'profile' && renderProfileTab()}
                </View>

                <ScrollingTicker rates={rates} tickerMessage={tickerMessage} />
            </View>
        </KeyboardAvoidingView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
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
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: '#D32F2F',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutTxt: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
    backLink: { padding: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
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
    tabItemActive: { borderBottomColor: '#1976D2' },
    tabTxt: { fontSize: 14, color: '#666', marginLeft: 8, fontWeight: '500' },
    tabTxtActive: { color: '#1976D2', fontWeight: 'bold' },
    contentArea: { flex: 1, padding: 15 },
    tabContent: { flex: 1 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 18,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cardHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    cardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    cardSubtext: { fontSize: 12, color: '#777', marginBottom: 14 },

    // Live rates
    liveDot: { flexDirection: 'row', alignItems: 'center' },
    liveDotCircle: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: '#4CAF50', marginRight: 5,
    },
    liveDotTxt: { fontSize: 11, color: '#4CAF50', fontWeight: 'bold', letterSpacing: 1 },
    liveRateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
    liveRateCard: {
        flex: 1, minWidth: '28%',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
    },
    liveRateName: { fontSize: 11, color: '#666', fontWeight: '600', textAlign: 'center', marginBottom: 4 },
    liveRateVal: { fontSize: 16, fontWeight: 'bold', color: '#1B5E20' },
    liveRateSubVal: { fontSize: 11, color: '#888', marginTop: 2 },
    inrTag: {
        fontSize: 9, color: '#388E3C', fontWeight: 'bold',
        backgroundColor: '#E8F5E9', borderRadius: 3,
        paddingHorizontal: 4, paddingVertical: 1, marginTop: 3,
    },
    sectionDividerTxt: {
        fontSize: 12, color: '#999', fontWeight: 'bold',
        textTransform: 'uppercase', marginVertical: 8,
        borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 8,
    },
    productRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
    },
    productName: { fontSize: 13, color: '#333', flex: 1 },
    productSell: { fontSize: 13, color: '#1B5E20', fontWeight: 'bold' },

    // Toggle buttons
    toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    toggleBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 12, borderRadius: 8,
        borderWidth: 1.5, borderColor: '#1976D2',
        backgroundColor: '#FFF',
    },
    toggleBtnActive: { backgroundColor: '#1976D2', borderColor: '#1976D2' },
    toggleBtnModifiedActive: { backgroundColor: '#F57F17', borderColor: '#F57F17' },
    toggleBtnTxt: { fontWeight: 'bold', fontSize: 14, color: '#1976D2' },
    toggleBtnTxtActive: { color: '#FFF' },
    toggleStatusTxt: { fontSize: 12, color: '#666', textAlign: 'center', fontStyle: 'italic' },

    // Reset
    resetBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 10, borderRadius: 6,
        borderWidth: 1, borderColor: '#D32F2F',
    },
    resetBtnTxt: { color: '#D32F2F', fontWeight: '600', fontSize: 13 },

    // Live product rows (RTGS rates display)
    liveProductRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    liveProductName: { fontSize: 13, color: '#333', fontWeight: '600', flex: 1 },
    liveProductVals: { flexDirection: 'row', gap: 16 },
    liveProductValBox: { alignItems: 'flex-end' },
    liveProductValLabel: { fontSize: 9, color: '#999', fontWeight: 'bold', textTransform: 'uppercase' },
    liveProductVal: { fontSize: 15, color: '#1B5E20', fontWeight: 'bold' },

    // Video / form
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: {
        borderWidth: 1, borderColor: '#DDD', borderRadius: 5,
        padding: 10, marginBottom: 15, backgroundColor: '#FAFAFA',
    },
    videoItem: {
        backgroundColor: '#FAFAFA', padding: 10, borderRadius: 5,
        marginBottom: 10, borderWidth: 1, borderColor: '#EEE',
    },
    dashedBtn: {
        borderWidth: 1, borderColor: '#DDD', borderStyle: 'dashed',
        padding: 12, borderRadius: 5, alignItems: 'center',
    },
    primaryBtn: { backgroundColor: '#1976D2', padding: 12, borderRadius: 5, alignItems: 'center' },
    primaryBtnTxt: { color: '#FFF', fontWeight: 'bold' },
    secondaryBtn: { backgroundColor: '#FFA000', padding: 12, borderRadius: 5, alignItems: 'center' },
    secondaryBtnTxt: { color: '#FFF', fontWeight: 'bold' },

    // Login
    loginContainer: {
        flex: 1, padding: 20, backgroundColor: '#FFF', justifyContent: 'center',
    },
    backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10 },
    signInTitle: {
        fontSize: 28, fontWeight: 'bold', color: '#333',
        marginBottom: 40, textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12,
        paddingHorizontal: 15, paddingVertical: 12, marginBottom: 15,
        backgroundColor: '#FAFAFA',
    },
    inputIcon: { marginRight: 10 },
    inputField: { flex: 1, fontSize: 16, color: '#333' },
    signInButton: {
        backgroundColor: '#880E4F', paddingVertical: 16,
        borderRadius: 12, alignItems: 'center', marginTop: 10,
    },
    signInButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default AdminScreen;
