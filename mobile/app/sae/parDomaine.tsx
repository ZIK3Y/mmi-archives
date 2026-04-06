import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useSaeList } from '@/hooks/useSaeList';
import { SaeCard } from '@/components/SaeCard';
import { BackHeader } from '@/components/BackHeader';
import { Colors, DomaineColors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

const DOMAINES = ['Web', 'Développement', 'DI', '3D', 'Création', 'Autre'];

export default function ParDomaineScreen() {
  const [domaine, setDomaine] = useState(DOMAINES[0]);
  const { saes, loading, error } = useSaeList('domaine', domaine);

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="SAé par domaine" />

      <ScrollView
        horizontal
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContent}
        showsHorizontalScrollIndicator={false}
      >
        {DOMAINES.map((d) => {
          const active = domaine === d;
          const palette = DomaineColors[d] ?? { text: Colors.domaineAutre, bg: '#E8E8E8' };
          return (
            <TouchableOpacity
              key={d}
              style={[
                styles.chip,
                { borderColor: palette.text },
                active && { backgroundColor: palette.text },
              ]}
              onPress={() => setDomaine(d)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, { color: active ? '#fff' : palette.text }]}>
                {d}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.textSecondary} />
          <Text style={styles.loadingText}>Chargement…</Text>
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
          keyExtractor={(item) => String(item.idSae)}
          renderItem={({ item }) => <SaeCard sae={item} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            saes.length > 0 ? (
              <Text style={styles.resultCount}>{saes.length} SAé en {domaine}</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="inbox" size={28} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Aucune SAé pour « {domaine} »</Text>
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

  chipScroll: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  chipText: { fontSize: 13, fontWeight: '600' },

  list: { paddingTop: 8, paddingBottom: 30 },
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
