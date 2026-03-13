import { Redirect } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator color="#00C8FF" size="large" />
      </View>
    );
  }

  if (usuario) return <Redirect href="/(tabs)/home" />;
  return <Redirect href="/auth" />;
}
