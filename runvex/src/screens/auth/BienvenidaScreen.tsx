import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import RunvexButton from '../../components/RunvexButton';
import { COLORS, FONTS, SPACING } from '../../utils/theme';

const { width, height } = Dimensions.get('window');

// Imagen de bienvenida - runner con efecto neón (asset local)
const BG_IMAGE = { uri: 'https://www.figma.com/api/mcp/asset/44b448cd-9032-4a8f-9ae0-f68a3ae61c89' };

export default function BienvenidaScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BG_IMAGE} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safe}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>RUNVEX</Text>
            </View>

            {/* Botones */}
            <View style={styles.buttonsContainer}>
              <RunvexButton
                title="INICIAR SESIÓN"
                onPress={() => router.push('/auth/login')}
                variant="outline"
                style={styles.btn}
                textStyle={styles.btnText}
              />
              <RunvexButton
                title="REGISTARSE"
                onPress={() => router.push('/auth/registro')}
                variant="outline"
                style={[styles.btn, styles.btnSecondary]}
                textStyle={styles.btnText}
              />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bg: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: SPACING.xxl,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    paddingTop: 80,
    alignItems: 'center',
  },
  logo: {
    fontFamily: FONTS.audiowide,
    fontSize: 72,
    color: COLORS.text,
    textAlign: 'center',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  buttonsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  btn: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  btnText: {
    color: '#000',
    fontFamily: FONTS.daysOne,
    fontSize: 20,
  },
});
