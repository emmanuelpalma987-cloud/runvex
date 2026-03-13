import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { COLORS, TAB_BAR_HEIGHT } from '../utils/theme';

const tabs = [
  { icon: '🏠', label: 'Inicio', route: '/(tabs)/home' },
  { icon: '🗺️', label: 'Rutas', route: '/(tabs)/rutas' },
  { icon: '🏁', label: 'Carrera', route: '/(tabs)/carrera' },
  { icon: '📊', label: 'Stats', route: '/(tabs)/resultados' },
  { icon: '👤', label: 'Perfil', route: '/(tabs)/perfil' },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = pathname.includes(tab.route.split('/')[2]);
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, active && styles.iconActive]}>
              <View style={styles.iconCircle}>
                <React.Fragment>
                  {/* Text emoji as icon placeholder */}
                  <View style={[styles.dot, active && styles.dotActive]} />
                </React.Fragment>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(5,10,21,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    height: TAB_BAR_HEIGHT,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 999,
  },
  iconActive: {
    backgroundColor: 'rgba(0,200,255,0.15)',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
});
