import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

function TabIcon({ focused, label }: { focused: boolean; label: string }) {
  const icons: Record<string, string> = {
    home: '🏠', rutas: '🗺️', carrera: '🏁', resultados: '📊', perfil: '👤',
  };
  return (
    <View style={[tab.wrap, focused && tab.active]}>
      <Text style={tab.icon}>{icons[label] ?? '●'}</Text>
    </View>
  );
}

const tab = StyleSheet.create({
  wrap: { padding: 6, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minWidth: 44 },
  active: { backgroundColor: 'rgba(0,200,255,0.18)' },
  icon: { fontSize: 22 },
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(5,10,21,0.97)',
          borderTopColor: 'rgba(255,255,255,0.12)',
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'DaysOne_400Regular',
          fontSize: 10,
          color: '#fff',
        },
        tabBarActiveTintColor: '#00C8FF',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
      }}
    >
      <Tabs.Screen name="home"
        options={{ title:'Inicio', tabBarIcon:({focused})=><TabIcon focused={focused} label="home"/> }} />
      <Tabs.Screen name="rutas"
        options={{ title:'Rutas', tabBarIcon:({focused})=><TabIcon focused={focused} label="rutas"/> }} />
      <Tabs.Screen name="carrera"
        options={{ title:'Carrera', tabBarIcon:({focused})=><TabIcon focused={focused} label="carrera"/> }} />
      <Tabs.Screen name="resultados"
        options={{ title:'Stats', tabBarIcon:({focused})=><TabIcon focused={focused} label="resultados"/> }} />
      <Tabs.Screen name="perfil"
        options={{ title:'Perfil', tabBarIcon:({focused})=><TabIcon focused={focused} label="perfil"/> }} />
    </Tabs>
  );
}
