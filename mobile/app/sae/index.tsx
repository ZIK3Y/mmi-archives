import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { useSaeList } from '@/hooks/useSaeList';
import { SaeCard } from '@/components/SaeCard';
import { BackHeader } from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function SaeListScreen() {
  const { saes, loading, error } = useSaeList('all');
  const [search, setSearch] = useState('');

  const filtered = saes.filter(
    (s) =>
      s.titre.toLowerCase().includes(search.toLowerCase()) ||
      s.domaine.toLowerCase().includes(search.toLowerCase()) ||
      s.anneePromo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="SAé" rightAction={<Text style={styles.count}>{saes.length} projets</Text>} />

      <View style={styles.searchWrapper}>
        <Feather name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre, domaine…"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Feather name="x" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.textSecondary} />
          <Text style={styles.loadingText}>Chargement…</Text>
        </View>
      )}

      {error && (
        <View style={styles.centered}>
          <Feather name="wifi-off" size={32} color={Colors.textMuted} />
          <Text style={styles.errorText}>Impossible de charger les SAé</Text>
          <Text style={styles.errorSub}>Vérifiez la connexion au serveur</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <SaeCard sae={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="inbox" size={32} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Aucune SAé trouvée</Text>
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

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },

  list: { paddingTop: 4, paddingBottom: 30 },

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
