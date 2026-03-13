import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/hooks/useAuth';
import { obtenerUltimaCarrera, obtenerCarreras } from '../../src/database/database';

const fmtTime = (seg: number) => {
  const m = Math.floor(seg/60), s = seg%60;
  return `${String(m).padStart(2,'0')} min ${String(s).padStart(2,'0')} s`;
};
const fmtPace = (dist: number, seg: number) => {
  if (dist === 0) return '--:--';
  const ps = seg/dist, m = Math.floor(ps/60), s = Math.floor(ps%60);
  return `${m}:${String(s).padStart(2,'0')} min/km`;
};

interface StatCardProps { icon: string; value: string; label: string; }
const StatCard = ({ icon, value, label }: StatCardProps) => (
  <View style={s.card}>
    <Text style={s.cardIcon}>{icon}</Text>
    <View>
      <Text style={s.cardVal}>{value}</Text>
      <Text style={s.cardLbl}>{label}</Text>
    </View>
  </View>
);

export default function ResultadosScreen() {
  const { usuario } = useAuth();
  const [carrera, setCarrera] = useState<any>(null);
  const [historial, setHistorial] = useState<any[]>([]);
  const [tab, setTab] = useState<'ultima'|'historial'>('ultima');

  useEffect(() => {
    if (!usuario?.id) return;
    obtenerUltimaCarrera(usuario.id).then(setCarrera).catch(()=>{});
    obtenerCarreras(usuario.id).then(setHistorial).catch(()=>{});
  }, [usuario]);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#050A15','#0A1020']} style={s.bg}>
        <SafeAreaView style={s.safe}>
          <Text style={s.title}>Resultados</Text>
          <View style={s.divider} />

          {/* Tabs */}
          <View style={s.tabRow}>
            <TouchableOpacity style={[s.tabBtn, tab==='ultima'&&s.tabActive]} onPress={()=>setTab('ultima')}>
              <Text style={[s.tabText, tab==='ultima'&&s.tabTextActive]}>Última carrera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.tabBtn, tab==='historial'&&s.tabActive]} onPress={()=>setTab('historial')}>
              <Text style={[s.tabText, tab==='historial'&&s.tabTextActive]}>Historial</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={s.scroll}>
            {tab === 'ultima' && (
              carrera ? (
                <View style={s.statsGrid}>
                  <StatCard icon="🏃" value={`${carrera.distancia_km.toFixed(2)} km`} label="Distancia" />
                  <StatCard icon="❤️" value={`${carrera.bpm_promedio} bpm`} label="BPM Prom." />
                  <StatCard icon="⏱️" value={fmtTime(carrera.tiempo_segundos)} label="Tiempo" />
                  <StatCard icon="💓" value={`${carrera.bpm_maximo} ppm`} label="BPM Máx." />
                  <StatCard icon="🔥" value={`${carrera.calorias} kcal`} label="Calorías" />
                  <StatCard icon="👟" value={`${carrera.pasos.toLocaleString()} pasos`} label="Pasos" />
                  <StatCard icon="⚡" value={fmtPace(carrera.distancia_km, carrera.tiempo_segundos)} label="Ritmo" />
                  <StatCard icon="⛰️" value={`+${carrera.elevacion_m.toFixed(0)} m`} label="Elevación" />
                </View>
              ) : (
                <Text style={s.empty}>No hay carreras registradas aún.{'\n'}¡Inicia tu primera carrera! 🏃</Text>
              )
            )}

            {tab === 'historial' && (
              historial.length > 0 ? (
                historial.map((c, i) => (
                  <View key={c.id} style={s.histCard}>
                    <Text style={s.histDate}>#{historial.length - i} · {new Date(c.fecha).toLocaleDateString('es-MX')}</Text>
                    <Text style={s.histVal}>{c.distancia_km.toFixed(2)} km · {fmtTime(c.tiempo_segundos)} · {c.calorias} kcal</Text>
                  </View>
                ))
              ) : (
                <Text style={s.empty}>No hay historial de carreras aún.</Text>
              )
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:'#050A15'}, bg:{flex:1}, safe:{flex:1},
  title:{fontFamily:'DaysOne_400Regular',fontSize:22,color:'#fff',textAlign:'center',paddingTop:16},
  divider:{height:1,backgroundColor:'rgba(255,255,255,0.15)',marginHorizontal:18,marginVertical:10},
  tabRow:{flexDirection:'row',marginHorizontal:18,marginBottom:12,gap:12},
  tabBtn:{flex:1,height:36,borderRadius:18,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'rgba(255,255,255,0.2)'},
  tabActive:{backgroundColor:'rgba(0,200,255,0.2)',borderColor:'rgba(0,200,255,0.5)'},
  tabText:{fontFamily:'DaysOne_400Regular',fontSize:13,color:'rgba(255,255,255,0.5)'},
  tabTextActive:{color:'#00C8FF'},
  scroll:{paddingHorizontal:18,paddingBottom:24},
  statsGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},
  card:{
    width:'47%',flexDirection:'row',alignItems:'center',gap:10,
    backgroundColor:'rgba(255,255,255,0.05)',borderRadius:16,
    borderWidth:1,borderColor:'rgba(255,255,255,0.12)',padding:14,
  },
  cardIcon:{fontSize:26},
  cardVal:{fontFamily:'DaysOne_400Regular',fontSize:14,color:'#fff'},
  cardLbl:{fontFamily:'DaysOne_400Regular',fontSize:10,color:'rgba(255,255,255,0.5)',marginTop:2},
  empty:{fontFamily:'DaysOne_400Regular',fontSize:16,color:'rgba(255,255,255,0.45)',textAlign:'center',marginTop:60,lineHeight:28},
  histCard:{
    backgroundColor:'rgba(255,255,255,0.05)',borderRadius:14,
    borderWidth:1,borderColor:'rgba(255,255,255,0.1)',
    padding:14,marginBottom:10,
  },
  histDate:{fontFamily:'DaysOne_400Regular',fontSize:12,color:'#00C8FF',marginBottom:4},
  histVal:{fontFamily:'DaysOne_400Regular',fontSize:14,color:'#fff'},
});
