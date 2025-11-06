import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 비밀번호 중복 확인 검증
  useEffect(() => {
    if (passwordConfirm.length > 0) {
      if (password !== passwordConfirm) {
        setPasswordMatchError('비밀번호가 일치하지 않습니다');
      } else {
        setPasswordMatchError('');
      }
    } else {
      setPasswordMatchError('');
    }
  }, [password, passwordConfirm]);

  const handleSignUp = () => {
    // 입력값 검증
    if (!email || !password || !passwordConfirm || !nickname) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    // TODO: 실제 회원가입 로직 구현
    console.log('SignUp:', { email, password, nickname });
    alert('회원가입이 완료되었습니다!');
    // 회원가입 성공 후 로그인 화면으로 이동
    router.replace('/login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#B5E5A8', '#A8D5BA', '#9FD4C7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
            {/* 뒤로가기 버튼 */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>

            {/* 로고 */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#6BC77A', '#52C57A', '#3FC57A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoCircle}>
                <View style={styles.logoInnerCircle}>
                  <Image
                    source={require('@/assets/images/Calendar_Icon.png')}
                    style={styles.logoImage}
                    contentFit="contain"
                  />
                </View>
              </LinearGradient>
            </View>

            {/* 타이틀 */}
            <ThemedText style={styles.title}>회원가입</ThemedText>
            <View style={styles.underline} />

            {/* 입력 폼 */}
            <View style={styles.form}>
              {/* 닉네임 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>닉네임</Text>
                <TextInput
                  style={styles.input}
                  placeholder="닉네임을 입력하세요"
                  placeholderTextColor="#999"
                  value={nickname}
                  onChangeText={setNickname}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* 이메일 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>이메일</Text>
                <TextInput
                  style={styles.input}
                  placeholder="이메일을 입력하세요"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* 비밀번호 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호를 입력하세요 (6자 이상)"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {/* 비밀번호 확인 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>비밀번호 확인</Text>
                <TextInput
                  style={[
                    styles.input,
                    passwordMatchError ? styles.inputError : null,
                  ]}
                  placeholder="비밀번호를 다시 입력하세요"
                  placeholderTextColor="#999"
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {passwordMatchError ? (
                  <Text style={styles.errorText}>{passwordMatchError}</Text>
                ) : null}
              </View>

              {/* 회원가입 버튼 */}
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}>
                <Text style={styles.signUpButtonText}>회원가입</Text>
              </TouchableOpacity>

              {/* 로그인 링크 */}
              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.push('/login')}>
                <Text style={styles.loginLinkText}>
                  이미 계정이 있으신가요? 로그인
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2D8650',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3FC57A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoInnerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D8650',
    textAlign: 'center',
    marginBottom: 8,
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: '#52C57A',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D8650',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgba(82, 197, 122, 0.3)',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  signUpButton: {
    backgroundColor: '#52C57A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#52C57A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#2D8650',
    fontSize: 14,
    fontWeight: '500',
  },
});
