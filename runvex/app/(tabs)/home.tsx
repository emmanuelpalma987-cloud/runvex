import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, SafeAreaView,
  StatusBar, TouchableOpacity, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/hooks/useAuth';
import { obtenerUltimaCarrera } from '../../src/database/database';

const BG = { uri: 'https://www.figma.com/api/mcp/asset/37f18608-abbc-4ff9-93b3-0b480ceb8930' };

export default function HomeScreen() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [ultima, setUltima] = useState<any>(null);

  useEffect(() => {
    if (usuario?.id) {
      obtenerUltimaCarrera(usuario.id).then(setUltima).catch(()=>{});
    }
  }, [usuario]);

  const fmtTime = (seg: number) => {
    const m = Math.floor(seg/60), s = seg%60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BG} style={s.bg} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.55)','rgba(0,5,20,0.75)']} style={s.overlay}>
          <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scroll}>

              {/* Header */}
              <Text style={s.homeLabel}>HOME</Text>
              <View style={s.divider} />

              {/* Stats última carrera */}
              <View style={s.statsRow}>
                <View style={s.statBox}>
                  <Text style={s.statVal}>{ultima ? `${ultima.distancia_km.toFixed(2)} KM` : '0.00 KM'}</Text>
                  <Text style={s.statLbl}>DISTANCIA</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statBox}>
                  <Text style={s.statVal}>{ultima ? fmtTime(ultima.tiempo_segundos) : '00:00'}</Text>
                  <Text style={s.statLbl}>TIEMPO</Text>
                </View>
              </View>
              <View style={s.statsRow}>
                <View style={s.statBox}>
                  <Text style={s.statVal}>{ultima ? `${ultima.velocidad_promedio.toFixed(2)} km/h` : '0.00 MIN/KM'}</Text>
                  <Text style={s.statLbl}>RITMO</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statBox}>
                  <Text style={s.statVal}>{ultima ? `${ultima.calorias} Cal` : '0 Cal'}</Text>
                  <Text style={s.statLbl}>CALORÍAS</Text>
                </View>
              </View>
              <View style={s.divider} />

              {/* Botón principal Iniciar Carrera */}
              <View style={s.startWrap}>
                <TouchableOpacity
                  style={s.startBtn}
                  onPress={() => router.push('/(tabs)/carrera')}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['rgba(0,200,255,0.18)','rgba(255,106,0,0.18)']}
                    style={s.startGrad}
                  >
                    <View style={s.startInner}>
                      <Text style={s.startText}>Iniciar{'\n'}Carrera</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Racha */}
              <View style={s.rachaCard}>
                <Text style={s.rachaEmoji}>🔥</Text>
                <Text style={s.rachaText}>Racha: {usuario?.racha ?? 0}</Text>
              </View>

              {/* Clima simulado */}
              <View style={s.weatherRow}>
                <Text style={s.weatherIcon}>⛅</Text>
                <Text style={s.weatherTemp}>21 °C</Text>
                <Text style={s.weatherDesc}>Parcialmente{'\n'}nublado</Text>
              </View>

            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:'#000'}, bg:{flex:1}, overlay:{flex:1}, safe:{flex:1},
  scroll:{paddingBottom:24},
  homeLabel:{fontFamily:'DaysOne_400Regular',fontSize:22,color:'#f9f9f9',textAlign:'center',paddingTop:16,marginBottom:8},
  divider:{height:1,backgroundColor:'rgba(255,255,255,0.2)',marginHorizontal:16,marginVertical:8},
  statsRow:{flexDirection:'row',paddingHorizontal:16,paddingVertical:4},
  statBox:{flex:1,alignItems:'center'},
  statVal:{fontFamily:'DaysOne_400Regular',fontSize:20,color:'#fff'},
  statLbl:{fontFamily:'DaysOne_400Regular',fontSize:11,color:'rgba(255,255,255,0.55)',marginTop:2},
  statDivider:{width:1,backgroundColor:'rgba(255,255,255,0.2)',marginVertical:4},
  startWrap:{alignItems:'center',marginVertical:20},
  startBtn:{width:240,height:240,borderRadius:120,overflow:'hidden',
    shadowColor:'#00C8FF',shadowOffset:{width:0,height:0},shadowOpacity:0.9,shadowRadius:32,elevation:12},
  startGrad:{flex:1,borderRadius:120,padding:4,borderWidth:2,borderColor:'rgba(0,200,255,0.6)'},
  startInner:{flex:1,borderRadius:120,backgroundColor:'rgba(0,0,0,0.7)',
    justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'rgba(255,106,0,0.4)'},
  startText:{fontFamily:'DaysOne_400Regular',fontSize:26,color:'#fff',textAlign:'center',lineHeight:34},
  rachaCard:{
    marginHorizontal:16,marginBottom:12,
    flexDirection:'row',alignItems:'center',gap:12,
    borderRadius:25,borderWidth:1,borderColor:'rgba(255,255,255,0.2)',
    padding:16,backgroundColor:'rgba(255,255,255,0.04)',
  },
  rachaEmoji:{fontSize:28},
  rachaText:{fontFamily:'DaysOne_400Regular',fontSize:22,color:'#fff'},
  weatherRow:{
    marginHorizontal:16,flexDirection:'row',alignItems:'center',gap:12,
    padding:12,borderRadius:16,backgroundColor:'rgba(255,255,255,0.04)',
    borderWidth:1,borderColor:'rgba(255,255,255,0.1)',
  },
  weatherIcon:{fontSize:40},
  weatherTemp:{fontFamily:'DaysOne_400Regular',fontSize:36,color:'#fff'},
  weatherDesc:{fontFamily:'DaysOne_400Regular',fontSize:13,color:'rgba(255,255,255,0.65)',lineHeight:18},
});
