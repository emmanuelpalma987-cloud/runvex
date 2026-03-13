import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useAuth } from '../../src/hooks/useAuth';
import { useRunTracker, formatTiempo } from '../../src/hooks/useRunTracker';
import { guardarCarrera } from '../../src/database/database';

export default function CarreraScreen() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { datos, iniciarCarrera, pausarCarrera, terminarCarrera } = useRunTracker();
  const mapRef = useRef<MapView>(null);

  const handlePausar = () => {
    if (datos.corriendo) pausarCarrera();
    else iniciarCarrera();
  };

  const handleTerminar = async () => {
    if (!datos.corriendo && datos.tiempoSegundos === 0) {
      Alert.alert('Sin carrera','Inicia una carrera primero.'); return;
    }
    Alert.alert('Terminar carrera','¿Deseas guardar los resultados?',[
      { text:'Cancelar', style:'cancel' },
      {
        text:'Guardar',
        onPress: async () => {
          const resultado = terminarCarrera();
          if (usuario?.id) {
            try {
              await guardarCarrera({
                usuario_id: usuario.id,
                distancia_km: resultado.distanciaKm,
                tiempo_segundos: resultado.tiempoSegundos,
                velocidad_promedio: resultado.velocidadPromedio,
                calorias: resultado.calorias,
                pasos: resultado.pasos,
                bpm_promedio: datos.bpmSimulado,
                bpm_maximo: datos.bpmSimulado + 10,
                elevacion_m: datos.elevacion,
                ruta_json: JSON.stringify(resultado.coordenadas),
              });
            } catch(e){ console.error(e); }
          }
          router.push('/(tabs)/resultados');
        },
      },
    ]);
  };

  const region = datos.coordenadas.length > 0 ? {
    latitude: datos.coordenadas[datos.coordenadas.length-1].latitude,
    longitude: datos.coordenadas[datos.coordenadas.length-1].longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  } : { latitude: 19.2869, longitude: -99.6531, latitudeDelta: 0.01, longitudeDelta: 0.01 };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#050A15','#0A1020']} style={s.bg}>
        <SafeAreaView style={s.safe}>

          <Text style={s.title}>Modo Carrera</Text>
          <View style={s.divider} />

          {/* Timer */}
          <Text style={s.timer}>{formatTiempo(datos.tiempoSegundos)}</Text>
          <View style={s.divider} />

          {/* Distancia */}
          <Text style={s.distancia}>{datos.distanciaKm.toFixed(2)} km</Text>
          <View style={s.divider} />

          {/* Velocidad */}
          <Text style={s.velocidad}>
            Vel. Prom: {datos.velocidadActual > 0 ? datos.velocidadActual.toFixed(1) : datos.velocidadPromedio.toFixed(1)} km/h.
          </Text>

          {/* Mapa */}
          <View style={s.mapWrap}>
            <MapView
              ref={mapRef}
              style={s.map}
              provider={PROVIDER_DEFAULT}
              region={region}
              mapType="satellite"
              showsUserLocation
              followsUserLocation={datos.corriendo}
            >
              {datos.coordenadas.length > 1 && (
                <Polyline
                  coordinates={datos.coordenadas}
                  strokeColor="#00C8FF"
                  strokeWidth={4}
                />
              )}
            </MapView>

            {/* BPM overlay */}
            <View style={s.bpmBadge}>
              <Text style={s.bpmText}>❤️ {datos.bpmSimulado} bpm</Text>
            </View>
          </View>

          {/* Botones */}
          <View style={s.btnRow}>
            <TouchableOpacity
              style={[s.btn, datos.corriendo ? s.btnPause : s.btnStart]}
              onPress={handlePausar}
              activeOpacity={0.85}
            >
              <Text style={s.btnText}>{datos.corriendo ? 'PAUSAR' : (datos.tiempoSegundos > 0 ? 'REANUDAR' : 'INICIAR')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, s.btnStop]} onPress={handleTerminar} activeOpacity={0.85}>
              <Text style={s.btnText}>TERMINAR</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:'#050A15'}, bg:{flex:1}, safe:{flex:1},
  title:{fontFamily:'DaysOne_400Regular',fontSize:22,color:'#fff',textAlign:'center',paddingTop:16},
  divider:{height:1,backgroundColor:'rgba(255,255,255,0.15)',marginHorizontal:18,marginVertical:8},
  timer:{fontFamily:'DaysOne_400Regular',fontSize:48,color:'#fff',textAlign:'center',letterSpacing:4},
  distancia:{fontFamily:'DaysOne_400Regular',fontSize:36,color:'#fff',textAlign:'center'},
  velocidad:{fontFamily:'DaysOne_400Regular',fontSize:18,color:'rgba(255,255,255,0.75)',textAlign:'center',marginBottom:8},
  mapWrap:{flex:1,marginHorizontal:18,borderRadius:16,overflow:'hidden',position:'relative'},
  map:{flex:1},
  bpmBadge:{
    position:'absolute',top:12,right:12,
    backgroundColor:'rgba(0,0,0,0.7)',borderRadius:12,
    paddingHorizontal:12,paddingVertical:6,
    borderWidth:1,borderColor:'rgba(255,100,100,0.5)',
  },
  bpmText:{fontFamily:'DaysOne_400Regular',fontSize:14,color:'#fff'},
  btnRow:{flexDirection:'row',paddingHorizontal:18,paddingVertical:16,gap:16},
  btn:{flex:1,height:48,borderRadius:25,justifyContent:'center',alignItems:'center'},
  btnStart:{backgroundColor:'rgba(0,200,255,0.25)',borderWidth:1,borderColor:'rgba(0,200,255,0.6)'},
  btnPause:{backgroundColor:'rgba(255,165,0,0.25)',borderWidth:1,borderColor:'rgba(255,165,0,0.6)'},
  btnStop:{backgroundColor:'rgba(255,59,48,0.25)',borderWidth:1,borderColor:'rgba(255,59,48,0.6)'},
  btnText:{fontFamily:'DaysOne_400Regular',fontSize:18,color:'#fff',letterSpacing:1},
});
