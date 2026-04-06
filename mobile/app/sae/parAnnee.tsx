import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { useSaeList } from '@/hooks/useSaeList';
import { SaeCard } from '@/components/SaeCard';
import { BackHeader } from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

const ANNEES = ['MMI2', 'MMI3'];

export default function ParAnneeScreen() {
  const [annee, setAnnee] = useState('MMI2');
  const { saes, loading, error } = useSaeList('annee', annee);

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="SAé par année" />

      <View style={styles.toggle}>
        {ANNEES.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.toggleBtn, annee === a && styles.toggleActive]}
            onPress={() => setAnnee(a)}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, annee === a && styles.toggleTextActive]}>
              {a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.textSecondary} />
          <Text style={styles.loadingText}>Chargement des SAé {annee}…</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centered}>
          <Feather name="wifi-off" size={28} color={Colors.textMuted} />
          <Text style={styles.errorText}>Impossible de charger les SAé</Text>
          <Text style={styles.errorSub}>Vérifiez la connexion au serveur</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={saes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <SaeCard sae={item} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            saes.length > 0 ? (
              <Text style={styles.resultCount}>{saes.length} SAé trouvées</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="inbox" size={28} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Aucune SAé pour {annee}</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  toggle: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: Colors.textPrimary },
  toggleText: { color: Colors.textMuted, fontWeight: '600', fontSize: 15 },
  toggleTextActive: { color: Colors.surface },

  list: { paddingBottom: 30 },
  resultCount: {
    fontSize: 12,
    color: Colors.textMuted,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 10,
  },
  loadingText: { color: Colors.textMuted, fontSize: 13 },
  errorText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  errorSub: { color: Colors.textMuted, fontSize: 13 },
  emptyText: { color: Colors.textMuted, fontSize: 14 },
});
