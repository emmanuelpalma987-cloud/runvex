import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../../src/hooks/useAuth';
import { guardarRuta, obtenerRutas } from '../../src/database/database';

const RUTAS_SORPRESA = [
  { nombre:'Ruta del Parque', distanciaKm:3.5, tiempoMin:25, coords:[{latitude:19.29,longitude:-99.65},{latitude:19.295,longitude:-99.648},{latitude:19.292,longitude:-99.643}] },
  { nombre:'Circuito Deportivo', distanciaKm:5.0, tiempoMin:35, coords:[{latitude:19.28,longitude:-99.66},{latitude:19.285,longitude:-99.655},{latitude:19.28,longitude:-99.65}] },
  { nombre:'Ruta del Bosque', distanciaKm:7.0, tiempoMin:42, coords:[{latitude:19.30,longitude:-99.67},{latitude:19.305,longitude:-99.665},{latitude:19.31,longitude:-99.66}] },
];

export default function RutasScreen() {
  const { usuario } = useAuth();
  const [rutasGuardadas, setRutasGuardadas] = useState<any[]>([]);
  const [region, setRegion] = useState({ latitude:19.2869, longitude:-99.6531, latitudeDelta:0.05, longitudeDelta:0.05 });
  const [rutaActiva, setRutaActiva] = useState<typeof RUTAS_SORPRESA[0]|null>(null);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(async ({ status }) => {
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({ latitude:loc.coords.latitude, longitude:loc.coords.longitude, latitudeDelta:0.05, longitudeDelta:0.05 });
      }
    });
    if (usuario?.id) obtenerRutas(usuario.id).then(setRutasGuardadas).catch(()=>{});
  }, [usuario]);

  const sorprendeme = async () => {
    const ruta = RUTAS_SORPRESA[Math.floor(Math.random()*RUTAS_SORPRESA.length)];
    setRutaActiva(ruta);
    Alert.alert('¡Ruta sugerida!', `${ruta.nombre}\n${ruta.distanciaKm} KM · ${ruta.tiempoMin} min`,[
      { text:'Cancelar', style:'cancel' },
      {
        text:'Guardar',
        onPress: async () => {
          if (usuario?.id) {
            await guardarRuta(usuario.id, ruta.nombre, ruta.distanciaKm, ruta.tiempoMin, ruta.coords);
            const updated = await obtenerRutas(usuario.id);
            setRutasGuardadas(updated);
          }
        },
      },
    ]);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#050A15','#0A1020']} style={s.bg}>
        <SafeAreaView style={s.safe}>
          <Text style={s.title}>Crear Ruta</Text>
          <View style={s.divider} />

          {/* Mapa */}
          <View style={s.mapWrap}>
            <MapView
              style={s.map}
              provider={PROVIDER_DEFAULT}
              region={region}
              mapType="satellite"
              showsUserLocation
            >
              {rutaActiva && rutaActiva.coords.map((c, i) => (
                <Marker key={i} coordinate={c} pinColor="#00C8FF" />
              ))}
            </MapView>
          </View>

          {/* Info ruta activa */}
          {rutaActiva && (
            <Text style={s.rutaInfo}>
              Distancia {rutaActiva.distanciaKm} KM · {rutaActiva.tiempoMin} min
            </Text>
          )}

          {/* Botón SORPRÉNDEME */}
          <TouchableOpacity style={s.sorpBtn} onPress={sorprendeme} activeOpacity={0.85}>
            <Text style={s.sorpText}>SORPRÉNDEME</Text>
          </TouchableOpacity>

          {/* Rutas guardadas */}
          <ScrollView contentContainerStyle={s.scroll}>
            {rutasGuardadas.length > 0 && (
              <>
                <Text style={s.sectionTitle}>Rutas guardadas</Text>
                {rutasGuardadas.map(r => (
                  <View key={r.id} style={s.histCard}>
                    <Text style={s.histNombre}>{r.nombre}</Text>
                    <Text style={s.histDatos}>{r.distancia_km} km · {r.tiempo_estimado_min} min</Text>
                  </View>
                ))}
              </>
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
  divider:{height:1,backgroundColor:'rgba(255,255,255,0.15)',marginHorizontal:18,marginVertical:8},
  mapWrap:{height:220,marginHorizontal:18,borderRadius:16,overflow:'hidden'},
  map:{flex:1},
  rutaInfo:{fontFamily:'DaysOne_400Regular',fontSize:15,color:'#fff',textAlign:'center',marginVertical:8},
  sorpBtn:{
    marginHorizontal:39,height:48,borderRadius:25,
    backgroundColor:'rgba(0,200,255,0.2)',borderWidth:1,borderColor:'rgba(0,200,255,0.5)',
    justifyContent:'center',alignItems:'center',marginBottom:12,
  },
  sorpText:{fontFamily:'DaysOne_400Regular',fontSize:18,color:'#fff',letterSpacing:1},
  scroll:{paddingHorizontal:18,paddingBottom:24},
  sectionTitle:{fontFamily:'DaysOne_400Regular',fontSize:14,color:'rgba(255,255,255,0.55)',marginBottom:10,marginTop:4},
  histCard:{
    backgroundColor:'rgba(255,255,255,0.05)',borderRadius:14,
    borderWidth:1,borderColor:'rgba(255,255,255,0.1)',
    padding:14,marginBottom:10,
  },
  histNombre:{fontFamily:'DaysOne_400Regular',fontSize:15,color:'#fff'},
  histDatos:{fontFamily:'DaysOne_400Regular',fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4},
});
