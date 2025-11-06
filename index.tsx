import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  // 장식용 원형 애니메이션
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 메인 애니메이션
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // 장식 원형 애니메이션
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle1Anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(circle1Anim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle2Anim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(circle2Anim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle3Anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(circle3Anim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const circle1Opacity = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  const circle2Opacity = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.5],
  });

  const circle3Opacity = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.55],
  });

  return (
    <LinearGradient
      colors={['#B5E5A8', '#A8D5BA', '#9FD4C7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      {/* 장식용 배경 원형들 */}
      <Animated.View
        style={[
          styles.decorativeCircle,
          styles.circle1,
          {
            opacity: circle1Opacity,
            transform: [
              {
                scale: circle1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.decorativeCircle,
          styles.circle2,
          {
            opacity: circle2Opacity,
            transform: [
              {
                scale: circle2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.decorativeCircle,
          styles.circle3,
          {
            opacity: circle3Opacity,
            transform: [
              {
                scale: circle3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.25],
                }),
              },
            ],
          },
        ]}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideUpAnim }],
            },
          ]}>
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
          <View style={styles.logoGlow} />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}>
          <ThemedText style={styles.appName}>SpeakPlan</ThemedText>
          <View style={styles.underline} />
          <ThemedText style={styles.tagline}>일정을 정리해봐요~</ThemedText>

          {/* 버튼 추가 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push('/main')}>
              <Text style={styles.buttonText}>시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/login')}>
              <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
  },
  circle3: {
    width: 180,
    height: 180,
    top: height * 0.3,
    right: width * 0.1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    overflow: 'visible',
  },
  logoContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  logoCircle: {
    width: 180,
    height: 180,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#061255ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoInnerCircle: {
    width: 160,
    height: 160,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 80,
    backgroundColor: 'rgba(63, 197, 122, 0.2)',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 30,
    overflow: 'visible',
    width: '100%',
  },
  appName: {
    fontSize: 30,
    lineHeight: 42,
    fontWeight: '800',
    color: '#fefeffff',
    letterSpacing: 0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: '#fefeffff',
    borderRadius: 2,
    marginBottom: 16,
    marginTop: 4,
  },
  tagline: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: '500',
    color: '#fefeffff',
    letterSpacing: 1,
    opacity: 0.9,
    marginBottom: 20,
  },
  logoImage: {
    width: 150,
    height: 150,
    borderRadius: 70,
  },
  buttonContainer: {
    marginTop: 10,
    width: '80%',
  },
  startButton: {
    backgroundColor: '#402b9eff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#6649b8ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
