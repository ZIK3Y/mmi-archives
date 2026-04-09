import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  Image, TouchableOpacity, Linking, Modal, Dimensions, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchSaeById } from '@/api/SaeApi';
import { Sae, Groupe } from '@/types/types';
import { Colors } from '@/constants/Colors';
import { BackHeader } from '@/components/BackHeader';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_W } = Dimensions.get('window');
const IMG_SIZE = (SCREEN_W - 48) / 2;

function noteColor(note: number, maxNote: number) {
  if (note === maxNote && maxNote > 0) return Colors.success;
  if (note < 10) return Colors.danger;
  return Colors.warning;
}

function noteBg(note: number, maxNote: number) {
  if (note === maxNote && maxNote > 0) return Colors.successBg;
  if (note < 10) return Colors.dangerBg;
  return Colors.warningBg;
}

export default function ProjetGroupeDetail() {
  const { idGroupe, idSae } = useLocalSearchParams();
  const [groupe, setGroupe] = useState<Groupe | null>(null);
  const [sae, setSae] = useState<Sae | null>(null);
  const [maxNote, setMaxNote] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    if (!idSae) return;
    fetchSaeById(idSae as string).then(data => {
      if (data) {
        setSae(data);
        const groupes = data.groupes ?? [];
        const found = groupes.find(g => g.idGroupe.toString() === idGroupe?.toString());
        if (found) setGroupe(found);
        const notes = groupes.map(g => g.note ?? 0).filter(n => n > 0);
        setMaxNote(notes.length > 0 ? Math.max(...notes) : 0);
      }
    }).finally(() => setLoading(false));
  }, [idGroupe, idSae]);

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="Projet" />
      <View style={styles.center}><ActivityIndicator size="large" color={Colors.accent} /></View>
    </SafeAreaView>
  );

  if (!groupe || !sae) return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="Projet" />
      <View style={styles.center}>
        <Feather name="alert-circle" size={32} color={Colors.textMuted} />
        <Text style={styles.errorText}>Groupe introuvable</Text>
      </View>
    </SafeAreaView>
  );

  const gNote = groupe.note ?? 0;
  const membres = groupe.membres ?? [];
  const images = groupe.images ?? [];
  const hasLinks = !!groupe.lienSite || !!groupe.lienProduction;

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title={groupe.nomGroupe ?? 'Projet'} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroSaeTitre} numberOfLines={2}>{sae.titre}</Text>
          <Text style={styles.heroGroupeNom}>{groupe.nomGroupe}</Text>
          <View style={[styles.noteBadge, { backgroundColor: noteBg(gNote, maxNote) }]}>
            <Feather name="award" size={14} color={noteColor(gNote, maxNote)} />
            <Text style={[styles.noteBadgeVal, { color: noteColor(gNote, maxNote) }]}>
              {gNote > 0 ? `${gNote.toFixed(2)}/20` : 'Non noté'}
            </Text>
          </View>
        </View>

        {/* Membres */}
        {membres.length > 0 && (
          <Section icon="users" title={`${membres.length} membre${membres.length > 1 ? 's' : ''}`}>
            {membres.map((nom, i) => (
              <View key={i} style={[styles.membreRow, i < membres.length - 1 && styles.membreRowBorder]}>
                <View style={styles.membreAvatar}>
                  <Text style={styles.membreInitial}>{nom.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.membreNom}>{nom}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* Liens du projet */}
        {hasLinks && (
          <Section icon="link" title="Liens du projet">
            <View style={styles.linksCol}>
              {!!groupe.lienSite && (
                <TouchableOpacity style={styles.linkBtn}
                  onPress={() => Linking.openURL(groupe.lienSite)} activeOpacity={0.7}>
                  <View style={styles.linkBtnIcon}>
                    <Feather name="globe" size={16} color={Colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.linkBtnLabel}>Lien du projet</Text>
                    <Text style={styles.linkBtnUrl} numberOfLines={1}>{groupe.lienSite}</Text>
                  </View>
                  <Feather name="external-link" size={14} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
              {!!groupe.lienProduction && (
                <TouchableOpacity style={styles.linkBtn}
                  onPress={() => Linking.openURL(groupe.lienProduction)} activeOpacity={0.7}>
                  <View style={styles.linkBtnIcon}>
                    <Feather name="github" size={16} color={Colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.linkBtnLabel}>Code source</Text>
                    <Text style={styles.linkBtnUrl} numberOfLines={1}>{groupe.lienProduction}</Text>
                  </View>
                  <Feather name="external-link" size={14} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </Section>
        )}

        {/* Galerie */}
        <Section icon="image" title={`Galerie${images.length > 0 ? ` (${images.length})` : ''}`}>
          {images.length > 0 ? (
            <View style={styles.imageGrid}>
              {images.map(img => (
                <TouchableOpacity key={img.idImage} onPress={() => setSelectedImg(img.url)} activeOpacity={0.85}>
                  <Image source={{ uri: img.url }} style={styles.thumb} resizeMode="cover" />
                  {!!img.legende && <Text style={styles.legende} numberOfLines={1}>{img.legende}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyGalerie}>
              <Feather name="image" size={24} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Aucune image pour ce projet</Text>
            </View>
          )}
        </Section>

      </ScrollView>

      {/* Lightbox */}
      <Modal visible={!!selectedImg} transparent animationType="fade">
        <TouchableOpacity style={styles.lightboxOverlay} onPress={() => setSelectedImg(null)} activeOpacity={1}>
          <TouchableOpacity style={styles.lightboxClose} onPress={() => setSelectedImg(null)}>
            <Feather name="x" size={20} color="#fff" />
          </TouchableOpacity>
          {selectedImg && <Image source={{ uri: selectedImg }} style={styles.lightboxImg} resizeMode="contain" />}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function Section({ icon, title, children }: { icon: keyof typeof Feather.glyphMap; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Feather name={icon} size={13} color={Colors.accent} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorText: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center' },

  hero: { backgroundColor: Colors.surface, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center', gap: 4 },
  heroSaeTitre: { fontSize: 11, fontWeight: '600', color: Colors.accent, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },
  heroGroupeNom: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  noteBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  noteBadgeVal: { fontSize: 20, fontWeight: '800' },

  section: { marginHorizontal: 16, marginTop: 16, backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surfaceAlt },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionBody: { padding: 14 },

  membreRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  membreRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  membreAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center' },
  membreInitial: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  membreNom: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },

  linksCol: { gap: 10 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surfaceAlt, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.border },
  linkBtnIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center' },
  linkBtnLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  linkBtnUrl: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: IMG_SIZE, height: IMG_SIZE, borderRadius: 8, backgroundColor: Colors.surfaceAlt },
  legende: { width: IMG_SIZE, fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  emptyGalerie: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { color: Colors.textMuted, fontStyle: 'italic', fontSize: 14 },

  lightboxOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  lightboxClose: { position: 'absolute', top: 52, right: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  lightboxImg: { width: SCREEN_W, height: SCREEN_W * 1.1 },
});
