import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, SafeAreaView,
  StatusBar, ScrollView, Alert, KeyboardAvoidingView,
  Platform, TextInput, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUsuario } from '../../src/database/database';
import { useAuth } from '../../src/hooks/useAuth';

const BG = { uri: 'https://www.figma.com/api/mcp/asset/37f18608-abbc-4ff9-93b3-0b480ceb8930' };

export default function LoginScreen() {
  const router = useRouter();
  const { setUsuario } = useAuth();
  const [usuario, setU] = useState('');
  const [contrasena, setC] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !contrasena.trim()) {
      Alert.alert('Error', 'Completa todos los campos.'); return;
    }
    setLoading(true);
    try {
      const user = await loginUsuario(usuario.trim(), contrasena);
      if (user) { setUsuario(user); router.replace('/(tabs)/home'); }
      else Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Error al iniciar sesión.');
    } finally { setLoading(false); }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BG} style={s.bg} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.35)','rgba(0,5,20,0.88)']} style={s.overlay}>
          <SafeAreaView style={s.safe}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
              <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
                {/* Avatar circular estilo Figma */}
                <View style={s.avatarWrap}>
                  <View style={s.avatar} />
                </View>

                <View style={s.form}>
                  <View style={s.inputBox}>
                    <TextInput style={s.input} placeholder="USUARIO" placeholderTextColor="rgba(255,255,255,0.4)"
                      value={usuario} onChangeText={setU} autoCapitalize="none" autoCorrect={false} />
                  </View>
                  <View style={s.inputBox}>
                    <TextInput style={s.input} placeholder="CONTRASEÑA" placeholderTextColor="rgba(255,255,255,0.4)"
                      value={contrasena} onChangeText={setC} secureTextEntry={!showPass} />
                    <TouchableOpacity onPress={()=>setShowPass(p=>!p)}>
                      <Text style={{color:'rgba(255,255,255,0.5)',fontSize:18}}>{showPass?'👁':'🙈'}</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={()=>router.push('/auth/recuperar')}>
                    <Text style={s.forgot}>OLVIDE MI CONTRASEÑA....</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={s.btnWhite} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
                    <Text style={s.btnTextDark}>{loading ? 'CARGANDO...' : 'ACCEDER'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>router.back()}>
                    <Text style={s.link}>¿No tienes cuenta? Regístrate</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:'#000'}, bg:{flex:1},
  overlay:{flex:1}, safe:{flex:1},
  scroll:{flexGrow:1,paddingHorizontal:39,paddingTop:40,paddingBottom:40},
  avatarWrap:{alignItems:'center',marginBottom:40,marginTop:20},
  avatar:{
    width:200,height:200,borderRadius:100,
    borderWidth:3,borderColor:'#00C8FF',
    backgroundColor:'rgba(0,200,255,0.08)',
    shadowColor:'#00C8FF',shadowOffset:{width:0,height:0},shadowOpacity:0.9,shadowRadius:24,
  },
  form:{gap:16},
  inputBox:{
    flexDirection:'row',alignItems:'center',
    backgroundColor:'rgba(255,255,255,0.07)',
    borderRadius:25,borderWidth:1,borderColor:'rgba(255,255,255,0.2)',
    height:48,paddingHorizontal:18,
  },
  input:{flex:1,fontFamily:'DaysOne_400Regular',fontSize:16,color:'#fff'},
  forgot:{fontFamily:'DaysOne_400Regular',color:'rgba(255,255,255,0.55)',fontSize:13,textAlign:'center',textDecorationLine:'underline'},
  btnWhite:{height:48,borderRadius:25,backgroundColor:'rgba(255,255,255,0.78)',justifyContent:'center',alignItems:'center'},
  btnTextDark:{fontFamily:'DaysOne_400Regular',fontSize:20,color:'#000',letterSpacing:1},
  link:{fontFamily:'DaysOne_400Regular',color:'#00C8FF',fontSize:13,textAlign:'center',textDecorationLine:'underline'},
});
