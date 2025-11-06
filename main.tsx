import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { Mic, Database, X } from 'lucide-react-native';
import {
  Animated,
  Easing,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';

type PickedFile = {
  uri?: string;
  name?: string;
  size?: number;
  mimeType?: string | null;
};

export default function MainScreen() {
  const calendarLink = useMemo(
    () =>
      Constants.expoConfig?.extra?.googleCalendarLink ??
      Constants.manifest2?.extra?.expoClient?.extra?.googleCalendarLink ??
      'https://calendar.google.com/calendar/r',
    []
  );

  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<PickedFile[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const profileScale = useRef(new Animated.Value(1)).current;
  const profileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    scaleAnim.stopAnimation();
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleRecordPress = () => {
    if (isRecording) {
      setIsRecording(false);
      stopPulse();
    } else {
      setIsRecording(true);
      startPulse();
    }
  };

  const handleFileSelect = async () => {
    try {
      const allowedMimeTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/mp4',
        'audio/x-m4a',
        'audio/m4a',
        'audio/flac',
        'audio/x-flac',
      ];
      const allowedExtensions = ['.mp3', '.mp4', '.m4a', '.flac'];

      const result = await DocumentPicker.getDocumentAsync({
        type: allowedMimeTypes,
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const files = (result.assets ?? []).filter((asset) => {
        const name = asset.name ?? '';
        const mimeType = asset.mimeType ?? '';
        const hasAllowedMime =
          allowedMimeTypes.includes(mimeType.toLowerCase());
        const hasAllowedExt = allowedExtensions.some((ext) =>
          name.toLowerCase().endsWith(ext)
        );

        return hasAllowedMime || hasAllowedExt;
      });

      if (files.length === 0) {
        Alert.alert(
          '지원하지 않는 파일',
          'mp3, mp4, m4a, flac 형식의 오디오 파일만 선택할 수 있습니다.'
        );
        return;
      }

      const normalizedFiles: PickedFile[] = files.map((asset) => ({
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        mimeType: asset.mimeType,
      }));

      setSelectedFiles(normalizedFiles);
      setIsModalVisible(true);
    } catch (err) {
      console.error('파일 선택 오류:', err);
      Alert.alert('파일 선택 오류', '파일을 선택하는 도중 문제가 발생했습니다.');
    }
  };

  const handleProfilePress = () => {
    setClickCount((prev) => prev + 1);

    Animated.sequence([
      Animated.timing(profileScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(profileScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (profileTimer.current) {
      clearTimeout(profileTimer.current);
    }

    profileTimer.current = setTimeout(() => {
      setClickCount(0);
      setIsProfileActive(false);
    }, 3000);

    if (clickCount === 0) {
      setIsProfileActive(true);
    } else if (clickCount === 1) {
      setIsProfileActive(false);
      setClickCount(0);
      alert('로그아웃 되었습니다!');
    }
  };

  useEffect(() => {
    return () => {
      if (profileTimer.current) {
        clearTimeout(profileTimer.current);
      }
    };
  }, []);

  const handleOpenCalendar = async () => {
    const candidates = [
      ...(Platform.select({
        ios: ['googlecalendar://', 'calshow://'],
        android: [
          'intent://calendar.google.com/calendar/r#Intent;package=com.google.android.calendar;scheme=https;end',
          'content://com.android.calendar/time/',
        ],
        default: [] as string[],
      }) ?? []),
      calendarLink,
    ];

    for (const url of candidates) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          return;
        }
      } catch {
        // proceed to next candidate
      }
    }
  };

  return (
    <LinearGradient
      colors={['#B5E5A8', '#A8D5BA', '#9FD4C7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ThemedText style={styles.backButtonText}>←</ThemedText>
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <ThemedText style={styles.appName}>SpeakPlan</ThemedText>

        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Animated.View
            style={[
              styles.profilePlaceholder,
              { backgroundColor: isProfileActive ? '#E74C3C' : 'rgba(255,255,255,0.4)' },
              { transform: [{ scale: profileScale }] },
            ]}>
            <ThemedText style={styles.profileInitial}>P</ThemedText>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: isRecording ? '#E74C3C' : '#52C57A' },
            ]}
            onPress={handleRecordPress}
            activeOpacity={0.8}>
            <Mic size={28} color="#fff" />
            <ThemedText style={styles.iconButtonText}>ON AIR</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#2D8650' }]}
          onPress={handleFileSelect}>
          <Database size={28} color="#fff" />
          <ThemedText style={styles.iconButtonText}>데이터 삽입</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOpenCalendar}
          accessibilityRole="button"
          accessibilityLabel="Google 캘린더 전체 보기">
          <View style={styles.calendarCard}>
            <Image
              source={require('@/assets/images/calendar_preview.png')}
              style={styles.calendarImage}
              resizeMode="cover"
            />
            <View style={styles.calendarOverlay}>
              <Text style={styles.calendarOverlayTitle}>일정 미리보기</Text>
              <Text style={styles.calendarOverlayCta}>탭하여 캘린더 앱으로 이동</Text>
            </View>
          </View>
        </TouchableOpacity>
        <ThemedText style={styles.calendarHint}>
          표시된 이미지는 고정된 미리보기입니다. 전체 일정은 캘린더 앱에서 확인하세요.
        </ThemedText>
      </View>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>📂 선택한 파일 목록</ThemedText>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedFiles.length > 0 ? (
              <FlatList
                data={selectedFiles}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.fileItem}>
                    <ThemedText style={styles.fileName}>{item.name ?? '이름 없음'}</ThemedText>
                    <ThemedText style={styles.fileSize}>
                      {item.size ? `${(item.size / 1024).toFixed(1)} KB` : '크기 알 수 없음'}
                    </ThemedText>
                  </View>
                )}
              />
            ) : (
              <ThemedText style={{ color: '#777', marginTop: 20 }}>
                선택된 파일이 없습니다.
              </ThemedText>
            )}

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#52C57A' }]}
                onPress={async () => {
                  setIsModalVisible(false);
                  await handleFileSelect();
                }}>
                <ThemedText style={styles.modalButtonText}>다시 선택</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#2D8650', opacity: 0.6 }]}
                onPress={() => {}}>
                <ThemedText style={styles.modalButtonText}>전송</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  backButtonText: { fontSize: 24, color: '#2D8650', fontWeight: 'bold' },
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 26, fontWeight: '800', color: '#2D8650' },
  profileButton: { position: 'absolute', right: 20, top: 0 },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { color: '#fff', fontWeight: '700', fontSize: 18 },
  buttonRow: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#52C57A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  calendarContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  calendarCard: {
    width: 500,
    height: 500,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(82, 197, 122, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 10,
    shadowColor: '#52C57A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
  },
  calendarImage: {
    width: '100%',
    height: '100%',
  },
  calendarOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  calendarOverlayTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  calendarOverlayCta: {
    color: '#fff',
    fontSize: 13,
    marginTop: 6,
  },
  calendarHint: {
    marginTop: 12,
    fontSize: 13,
    color: '#276845',
    opacity: 0.85,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#130935ff' },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fileName: { fontSize: 16, color: '#333' },
  fileSize: { fontSize: 14, color: '#666' },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
