import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/hooks/useAuth';
import { actualizarUsuario } from '../../src/database/database';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const { usuario, setUsuario, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
  });

  const handleGuardar = async () => {
    if (!usuario?.id) return;
    try {
      await actualizarUsuario(usuario.id, form);
      setUsuario({ ...usuario, ...form });
      setEditing(false);
      Alert.alert('Éxito','Perfil actualizado.');
    } catch(e:any) {
      Alert.alert('Error', e.message ?? 'No se pudo actualizar.');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión','¿Estás seguro?',[
      { text:'Cancelar', style:'cancel' },
      { text:'Salir', style:'destructive', onPress: async () => {
        await logout();
        router.replace('/auth');
      }},
    ]);
  };

  const Field = ({ label, field, editable }: { label:string; field:keyof typeof form; editable:boolean }) => (
    <View style={s.fieldBox}>
      <Text style={s.fieldLabel}>{label}</Text>
      {editable && editing ? (
        <TextInput
          style={s.fieldInput}
          value={form[field]}
          onChangeText={v => setForm(p=>({...p,[field]:v}))}
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      ) : (
        <Text style={s.fieldValue}>{form[field] || '—'}</Text>
      )}
    </View>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#050A15','#0A1020']} style={s.bg}>
        <SafeAreaView style={s.safe}>
          <Text style={s.title}>Perfil</Text>
          <View style={s.divider} />

          <ScrollView contentContainerStyle={s.scroll}>
            {/* Avatar */}
            <View style={s.avatarWrap}>
              <View style={s.avatar}>
                <Text style={s.avatarInitial}>
                  {(usuario?.nombre?.[0] ?? 'R').toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Calendar/racha */}
            <View style={s.rachaRow}>
              <Text style={s.rachaIcon}>🔥</Text>
              <Text style={s.rachaText}>Racha: {usuario?.racha ?? 0} días</Text>
            </View>

            {/* Campos */}
            <View style={s.fieldsWrap}>
              <Field label="NOMBRE:" field="nombre" editable />
              <Field label="APELLIDOS:" field="apellidos" editable />
              <Field label="CORREO:" field="correo" editable />
              <View style={s.fieldBox}>
                <Text style={s.fieldLabel}>USUARIO:</Text>
                <Text style={s.fieldValue}>{usuario?.usuario ?? '—'}</Text>
              </View>
              <View style={s.fieldBox}>
                <Text style={s.fieldLabel}>CONTRASEÑA:</Text>
                <Text style={s.fieldValue}>••••••••</Text>
              </View>
            </View>

            {/* Botones */}
            <View style={s.btnWrap}>
              {editing ? (
                <>
                  <TouchableOpacity style={s.btnCyan} onPress={handleGuardar} activeOpacity={0.85}>
                    <Text style={s.btnText}>GUARDAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.btnOutline} onPress={()=>setEditing(false)} activeOpacity={0.85}>
                    <Text style={s.btnText}>CANCELAR</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={s.btnCyan} onPress={()=>setEditing(true)} activeOpacity={0.85}>
                  <Text style={s.btnText}>EDITAR PERFIL</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={s.btnDanger} onPress={handleLogout} activeOpacity={0.85}>
                <Text style={s.btnText}>CERRAR SESIÓN</Text>
              </TouchableOpacity>
            </View>
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
  scroll:{paddingHorizontal:18,paddingBottom:40},
  avatarWrap:{alignItems:'center',marginBottom:16,marginTop:8},
  avatar:{
    width:160,height:160,borderRadius:80,
    backgroundColor:'rgba(0,200,255,0.1)',
    borderWidth:3,borderColor:'#00C8FF',
    justifyContent:'center',alignItems:'center',
    shadowColor:'#00C8FF',shadowOffset:{width:0,height:0},shadowOpacity:0.9,shadowRadius:20,
  },
  avatarInitial:{fontFamily:'Audiowide_400Regular',fontSize:60,color:'#00C8FF'},
  rachaRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginBottom:20},
  rachaIcon:{fontSize:24},
  rachaText:{fontFamily:'DaysOne_400Regular',fontSize:18,color:'#fff'},
  fieldsWrap:{gap:8,marginBottom:24},
  fieldBox:{
    backgroundColor:'rgba(255,255,255,0.05)',borderRadius:12,
    borderWidth:1,borderColor:'rgba(255,255,255,0.1)',
    paddingHorizontal:18,paddingVertical:10,
    flexDirection:'row',alignItems:'center',justifyContent:'space-between',
  },
  fieldLabel:{fontFamily:'DaysOne_400Regular',fontSize:14,color:'rgba(255,255,255,0.55)',minWidth:110},
  fieldValue:{fontFamily:'DaysOne_400Regular',fontSize:14,color:'#fff',flex:1,textAlign:'right'},
  fieldInput:{fontFamily:'DaysOne_400Regular',fontSize:14,color:'#00C8FF',flex:1,textAlign:'right'},
  btnWrap:{gap:12},
  btnCyan:{height:48,borderRadius:25,backgroundColor:'rgba(0,200,255,0.2)',borderWidth:1,borderColor:'rgba(0,200,255,0.5)',justifyContent:'center',alignItems:'center'},
  btnOutline:{height:48,borderRadius:25,backgroundColor:'rgba(255,255,255,0.06)',borderWidth:1,borderColor:'rgba(255,255,255,0.2)',justifyContent:'center',alignItems:'center'},
  btnDanger:{height:48,borderRadius:25,backgroundColor:'rgba(255,59,48,0.2)',borderWidth:1,borderColor:'rgba(255,59,48,0.5)',justifyContent:'center',alignItems:'center'},
  btnText:{fontFamily:'DaysOne_400Regular',fontSize:18,color:'#fff',letterSpacing:1},
});
