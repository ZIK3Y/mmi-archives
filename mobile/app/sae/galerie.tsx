import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { fetchAllSae } from '@/api/SaeApi';
import { Sae } from '@/types/types';
import { BackHeader } from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_W } = Dimensions.get('window');
const COLS = 2;
const GAP = 8;
const IMG_SIZE = (SCREEN_W - 32 - GAP) / COLS;

interface GalerieItem {
  uri: string;
  saeTitre: string;
  saeId: number;
}

export default function GalerieScreen() {
  const router = useRouter();
  const [items, setItems] = useState<GalerieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalerieItem | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const saes: Sae[] = await fetchAllSae();
        const all: GalerieItem[] = [];
        for (const sae of saes) {
          for (const uri of sae.images ?? []) {
            all.push({ uri, saeTitre: sae.titre, saeId: sae.idSae });
          }
        }
        setItems(all);
      } catch (e) {
        console.error('Erreur galerie:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="Galerie photos" />

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.textSecondary} />
          <Text style={styles.loadingText}>Chargement des photos…</Text>
        </View>
      )}

      {!loading && (
        <FlatList
          data={items}
          keyExtractor={(item, idx) => `${item.saeId}-${idx}`}
          numColumns={COLS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            items.length > 0 ? (
              <Text style={styles.count}>{items.length} photo{items.length > 1 ? 's' : ''}</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelected(item)} activeOpacity={0.85}>
              <Image source={{ uri: item.uri }} style={styles.thumb} resizeMode="cover" />
              <Text style={styles.thumbLabel} numberOfLines={1}>{item.saeTitre}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="image" size={32} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Aucune photo disponible</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal visible={!!selected} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setSelected(null)}
          activeOpacity={1}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
            <Feather name="x" size={18} color="#fff" />
          </TouchableOpacity>
          {selected && (
            <View style={styles.lightbox}>
              <Image
                source={{ uri: selected.uri }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() => {
                  setSelected(null);
                  router.push({ pathname: '/sae/[idSae]', params: { idSae: selected.saeId } });
                }}
                style={styles.lightboxLink}
              >
                <Feather name="external-link" size={13} color="rgba(255,255,255,0.7)" />
                <Text style={styles.lightboxLabel} numberOfLines={1}>
                  {selected.saeTitre}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, paddingBottom: 30 },
  count: { fontSize: 12, color: Colors.textMuted, marginBottom: 10 },
  row: { gap: GAP, marginBottom: GAP },
  thumb: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
  },
  thumbLabel: {
    width: IMG_SIZE,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    marginBottom: 2,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 10,
  },
  loadingText: { color: Colors.textMuted, fontSize: 13 },
  emptyText: { color: Colors.textMuted, fontSize: 14 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  lightbox: { width: '100%', alignItems: 'center', paddingHorizontal: 16 },
  fullImage: { width: SCREEN_W - 32, height: (SCREEN_W - 32) * 0.85, borderRadius: 10 },
  lightboxLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 16,
  },
  lightboxLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    flex: 1,
    textAlign: 'center',
  },
});
