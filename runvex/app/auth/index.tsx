import React from 'react';
import {
  View, Text, StyleSheet, ImageBackground,
  SafeAreaView, StatusBar, TouchableOpacity, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Imagen del runner neón extraída del Figma
const BG = { uri: 'https://www.figma.com/api/mcp/asset/44b448cd-9032-4a8f-9ae0-f68a3ae61c89' };

export default function BienvenidaScreen() {
  const router = useRouter();
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BG} style={s.bg} resizeMode="cover">
        <LinearGradient colors={['transparent','rgba(0,0,0,0.25)','rgba(0,0,0,0.82)']} style={s.overlay}>
          <SafeAreaView style={s.safe}>
            <Text style={s.logo}>RUNVEX</Text>
            <View style={s.btns}>
              <TouchableOpacity style={s.btnWhite} onPress={() => router.push('/auth/login')} activeOpacity={0.85}>
                <Text style={s.btnTextDark}>INICIAR SESIÓN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnWhite} onPress={() => router.push('/auth/registro')} activeOpacity={0.85}>
                <Text style={s.btnTextDark}>REGISTARSE</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex:1, backgroundColor:'#000' },
  bg: { flex:1, width:'100%' },
  overlay: { flex:1, justifyContent:'space-between', paddingBottom:48 },
  safe: { flex:1, justifyContent:'space-between' },
  logo: {
    fontFamily:'Audiowide_400Regular', fontSize:72, color:'#fff',
    textAlign:'center', marginTop:80,
    textShadowColor:'#00C8FF', textShadowOffset:{width:0,height:0}, textShadowRadius:24,
  },
  btns: { paddingHorizontal:39, gap:16 },
  btnWhite: {
    height:48, borderRadius:25, backgroundColor:'rgba(255,255,255,0.78)',
    justifyContent:'center', alignItems:'center',
  },
  btnTextDark: { fontFamily:'DaysOne_400Regular', fontSize:20, color:'#000', letterSpacing:1 },
});
