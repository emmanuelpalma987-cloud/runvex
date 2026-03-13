import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import RunvexButton from '../../components/RunvexButton';
import RunvexInput from '../../components/RunvexInput';
import { COLORS, FONTS, SPACING } from '../../utils/theme';
import { loginUsuario } from '../../database/database';
import { useAuth } from '../../hooks/useAuth';

const BG_IMAGE = { uri: 'https://www.figma.com/api/mcp/asset/37f18608-abbc-4ff9-93b3-0b480ceb8930' };

export default function LoginScreen() {
  const router = useRouter();
  const { setUsuario } = useAuth();
  const [usuario, setUsuarioInput] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !contrasena.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const user = await loginUsuario(usuario.trim(), contrasena);
      if (user) {
        setUsuario(user);
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BG_IMAGE} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,5,20,0.85)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Avatar circular */}
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar} />
                </View>

                {/* Campos */}
                <View style={styles.form}>
                  <RunvexInput
                    placeholder="USUARIO"
                    value={usuario}
                    onChangeText={setUsuarioInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                  />
                  <RunvexInput
                    placeholder="CONTRASEÑA"
                    value={contrasena}
                    onChangeText={setContrasena}
                    secureEntry
                    style={styles.input}
                  />

                  <Text
                    style={styles.forgotText}
                    onPress={() => router.push('/auth/recuperar')}
                  >
                    OLVIDE MI CONTRASEÑA....
                  </Text>

                  <RunvexButton
                    title="ACCEDER"
                    onPress={handleLogin}
                    loading={loading}
                    style={styles.btn}
                    textStyle={{ color: '#000' }}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  bg: { flex: 1 },
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 40,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    marginTop: SPACING.lg,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0,200,255,0.1)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  form: {
    gap: SPACING.md,
  },
  input: {
    fontFamily: FONTS.daysOne,
  },
  forgotText: {
    fontFamily: FONTS.daysOne,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: -SPACING.xs,
  },
  btn: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    marginTop: SPACING.sm,
  },
});
