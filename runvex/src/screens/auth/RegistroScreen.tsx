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
import { crearUsuario } from '../../database/database';

const BG_IMAGE = { uri: 'https://www.figma.com/api/mcp/asset/37f18608-abbc-4ff9-93b3-0b480ceb8930' };

export default function RegistroScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    usuario: '',
    contrasena: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleRegistro = async () => {
    const { nombre, apellidos, correo, usuario, contrasena } = form;
    if (!nombre || !apellidos || !correo || !usuario || !contrasena) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await crearUsuario(nombre.trim(), apellidos.trim(), correo.trim().toLowerCase(), usuario.trim(), contrasena);
      Alert.alert('¡Éxito!', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.', [
        { text: 'OK', onPress: () => router.replace('/auth/login') },
      ]);
    } catch (e: any) {
      if (e.message?.includes('UNIQUE')) {
        Alert.alert('Error', 'El correo o nombre de usuario ya está registrado.');
      } else {
        Alert.alert('Error', e.message || 'No se pudo crear la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BG_IMAGE} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,5,20,0.92)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.title}>CREAR CUENTA</Text>

                <View style={styles.form}>
                  <RunvexInput
                    placeholder="NOMBRE:"
                    value={form.nombre}
                    onChangeText={update('nombre')}
                    autoCapitalize="words"
                  />
                  <RunvexInput
                    placeholder="APELLIDOS:"
                    value={form.apellidos}
                    onChangeText={update('apellidos')}
                    autoCapitalize="words"
                  />
                  <RunvexInput
                    placeholder="CORREO:"
                    value={form.correo}
                    onChangeText={update('correo')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <RunvexInput
                    placeholder="USUARIO:"
                    value={form.usuario}
                    onChangeText={update('usuario')}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <RunvexInput
                    placeholder="CONTRASEÑA:"
                    value={form.contrasena}
                    onChangeText={update('contrasena')}
                    secureEntry
                  />

                  <RunvexButton
                    title="CREAR CUENTA"
                    onPress={handleRegistro}
                    loading={loading}
                    style={styles.btn}
                    textStyle={{ color: '#000' }}
                  />

                  <Text style={styles.loginLink} onPress={() => router.back()}>
                    ¿Ya tienes cuenta? Inicia sesión
                  </Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontFamily: FONTS.audiowide,
    fontSize: 28,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  form: { gap: SPACING.md },
  btn: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    marginTop: SPACING.sm,
  },
  loginLink: {
    fontFamily: FONTS.daysOne,
    color: COLORS.primary,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
