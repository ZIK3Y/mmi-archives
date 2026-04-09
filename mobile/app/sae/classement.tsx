import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useSaeList } from '@/hooks/useSaeList';
import { SaeCard } from '@/components/SaeCard';
import { BackHeader } from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function ClassementScreen() {
  const { saes, loading, error } = useSaeList('classement');

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="Classement" rightAction={<Text style={styles.count}>{saes.length} SAÉ</Text>} />

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.textSecondary} />
          <Text style={styles.loadingText}>Chargement…</Text>
        </View>
      )}

      {error && (
        <View style={styles.centered}>
          <Feather name="wifi-off" size={32} color={Colors.textMuted} />
          <Text style={styles.errorText}>Impossible de charger le classement</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={saes}
          keyExtractor={(item) => String(item.idSae)}
          renderItem={({ item, index }) => (
            <SaeCard sae={item} showRank rank={index + 1} />
          )}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Feather name="bar-chart-2" size={14} color={Colors.textMuted} />
              <Text style={styles.listHeaderText}>Triées par note décroissante</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="inbox" size={32} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Aucune SAÉ disponible</Text>
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

  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  count: { fontSize: 13, color: Colors.textMuted },

  list: { paddingTop: 12, paddingBottom: 30 },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  listHeaderText: { color: Colors.textMuted, fontSize: 12 },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 10,
  },
  loadingText: { color: Colors.textMuted, fontSize: 13 },
  errorText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  emptyText: { color: Colors.textMuted, fontSize: 14 },
});
