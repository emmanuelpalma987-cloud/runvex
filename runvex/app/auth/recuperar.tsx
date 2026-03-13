import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, SafeAreaView,
  StatusBar, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const BG = { uri: 'https://www.figma.com/api/mcp/asset/37f18608-abbc-4ff9-93b3-0b480ceb8930' };

export default function RecuperarScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [step, setStep] = useState<1|2|3>(1);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BG} style={s.bg} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.4)','rgba(0,5,20,0.9)']} style={s.overlay}>
          <SafeAreaView style={s.safe}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={s.inner}>
              <Text style={s.title}>RECUPERAR{'\n'}CONTRASEÑA</Text>

              {step >= 1 && (
                <View style={s.inputBox}>
                  <TextInput style={s.input} placeholder="INGRESAR CORREO"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={correo} onChangeText={setCorreo}
                    keyboardType="email-address" autoCapitalize="none" />
                </View>
              )}

              {step >= 1 && (
                <TouchableOpacity style={s.btn} onPress={()=>{ if(!correo){ Alert.alert('Error','Ingresa tu correo.'); return; } Alert.alert('Código enviado','Revisa tu correo (simulado).'); setStep(2); }} activeOpacity={0.85}>
                  <Text style={s.btnText}>ENVIAR CODIGO</Text>
                </TouchableOpacity>
              )}

              {step >= 2 && (
                <>
                  <View style={s.inputBox}>
                    <TextInput style={s.input} placeholder="INGRESA CODIGO"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={codigo} onChangeText={setCodigo} keyboardType="numeric" />
                  </View>
                  <TouchableOpacity style={[s.btn,s.btnGold]} onPress={()=>{ if(!codigo){ Alert.alert('Error','Ingresa el código.'); return; } setStep(3); }} activeOpacity={0.85}>
                    <Text style={s.btnText}>VALIDAR</Text>
                  </TouchableOpacity>
                </>
              )}

              {step >= 3 && (
                <Text style={s.success}>✅ Código válido. En un app real aquí podrías cambiar tu contraseña.</Text>
              )}

              <TouchableOpacity onPress={()=>router.back()} style={{marginTop:24}}>
                <Text style={s.back}>← Volver</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:'#000'}, bg:{flex:1}, overlay:{flex:1}, safe:{flex:1},
  inner:{flex:1,paddingHorizontal:39,paddingTop:60,gap:16},
  title:{fontFamily:'Audiowide_400Regular',fontSize:22,color:'#fff',textAlign:'center',marginBottom:24,lineHeight:32},
  inputBox:{
    flexDirection:'row',alignItems:'center',
    backgroundColor:'rgba(255,255,255,0.07)',
    borderRadius:25,borderWidth:1,borderColor:'rgba(255,255,255,0.2)',
    height:48,paddingHorizontal:18,
  },
  input:{flex:1,fontFamily:'DaysOne_400Regular',fontSize:16,color:'#fff'},
  btn:{height:48,borderRadius:25,backgroundColor:'rgba(0,200,255,0.2)',borderWidth:1,borderColor:'rgba(0,200,255,0.5)',justifyContent:'center',alignItems:'center'},
  btnGold:{backgroundColor:'rgba(255,215,0,0.15)',borderColor:'rgba(255,215,0,0.5)'},
  btnText:{fontFamily:'DaysOne_400Regular',fontSize:18,color:'#fff',letterSpacing:1},
  success:{fontFamily:'DaysOne_400Regular',color:'#00FF88',fontSize:15,textAlign:'center',marginTop:16},
  back:{fontFamily:'DaysOne_400Regular',color:'#00C8FF',fontSize:14,textAlign:'center',textDecorationLine:'underline'},
});
