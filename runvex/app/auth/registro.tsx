import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, SafeAreaView,
  StatusBar, ScrollView, Alert, KeyboardAvoidingView,
  Platform, TextInput, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { crearUsuario } from '../../src/database/database';

const BG = { uri: 'https://www.figma.com/api/mcp/asset/37f18608-abbc-4ff9-93b3-0b480ceb8930' };

export default function RegistroScreen() {
  const router = useRouter();
  const [f, setF] = useState({ nombre:'', apellidos:'', correo:'', usuario:'', contrasena:'' });
  const [loading, setLoading] = useState(false);
  const upd = (k: keyof typeof f) => (v: string) => setF(p => ({...p,[k]:v}));

  const handleRegister = async () => {
    const {nombre,apellidos,correo,usuario,contrasena} = f;
    if (!nombre||!apellidos||!correo||!usuario||!contrasena) {
      Alert.alert('Error','Completa todos los campos.'); return;
    }
    if (contrasena.length < 6) { Alert.alert('Error','Contraseña mín. 6 caracteres.'); return; }
    setLoading(true);
    try {
      await crearUsuario(nombre.trim(),apellidos.trim(),correo.trim().toLowerCase(),usuario.trim(),contrasena);
      Alert.alert('¡Éxito!','Cuenta creada. Ahora inicia sesión.',[
        {text:'OK', onPress:()=>router.replace('/auth/login')}
      ]);
    } catch(e:any) {
      Alert.alert('Error', e.message?.includes('UNIQUE') ? 'Correo o usuario ya registrado.' : (e.message||'Error al registrar.'));
    } finally { setLoading(false); }
  };

  const Field = ({ph,k,secure,kb}:{ph:string,k:keyof typeof f,secure?:boolean,kb?:any}) => (
    <View style={s.inputBox}>
      <TextInput style={s.input} placeholder={ph} placeholderTextColor="rgba(255,255,255,0.4)"
        value={f[k]} onChangeText={upd(k)} secureTextEntry={secure}
        autoCapitalize={k==='nombre'||k==='apellidos'?'words':'none'} keyboardType={kb} autoCorrect={false} />
    </View>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BG} style={s.bg} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.5)','rgba(0,5,20,0.93)']} style={s.overlay}>
          <SafeAreaView style={s.safe}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
              <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
                <Text style={s.title}>CREAR CUENTA</Text>
                <View style={s.form}>
                  <Field ph="NOMBRE:" k="nombre" />
                  <Field ph="APELLIDOS:" k="apellidos" />
                  <Field ph="CORREO:" k="correo" kb="email-address" />
                  <Field ph="USUARIO:" k="usuario" />
                  <Field ph="CONTRASEÑA:" k="contrasena" secure />
                  <TouchableOpacity style={s.btnCyan} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
                    <Text style={s.btnTextWhite}>{loading?'CREANDO...':'CREAR CUENTA'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>router.back()}>
                    <Text style={s.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  root:{flex:1,backgroundColor:'#000'}, bg:{flex:1}, overlay:{flex:1}, safe:{flex:1},
  scroll:{flexGrow:1,paddingHorizontal:39,paddingTop:60,paddingBottom:40},
  title:{
    fontFamily:'Audiowide_400Regular',fontSize:26,color:'#fff',textAlign:'center',
    marginBottom:32,textShadowColor:'#00C8FF',textShadowOffset:{width:0,height:0},textShadowRadius:14,
  },
  form:{gap:14},
  inputBox:{
    flexDirection:'row',alignItems:'center',
    backgroundColor:'rgba(255,255,255,0.07)',
    borderRadius:25,borderWidth:1,borderColor:'rgba(255,255,255,0.2)',
    height:48,paddingHorizontal:18,
  },
  input:{flex:1,fontFamily:'DaysOne_400Regular',fontSize:16,color:'#fff'},
  btnCyan:{
    height:48,borderRadius:25,
    backgroundColor:'rgba(0,200,255,0.18)',
    borderWidth:1,borderColor:'rgba(0,200,255,0.5)',
    justifyContent:'center',alignItems:'center',marginTop:8,
  },
  btnTextWhite:{fontFamily:'DaysOne_400Regular',fontSize:20,color:'#fff',letterSpacing:1},
  link:{fontFamily:'DaysOne_400Regular',color:'#00C8FF',fontSize:13,textAlign:'center',textDecorationLine:'underline'},
});
