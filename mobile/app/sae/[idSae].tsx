import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Sae } from '@/types/types';
import { fetchSaeById, fetchSaeByNote } from '@/api/SaeApi';
import { BackHeader } from '@/components/BackHeader';
import { DomaineBadge } from '@/components/DomaineBadge';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_W } = Dimensions.get('window');
const IMG_SIZE = (SCREEN_W - 48) / 2;

type Tab = 'infos' | 'groupe' | 'galerie';

export default function SaeDetailScreen() {
  const { idSae } = useLocalSearchParams();
  const [sae, setSae] = useState<Sae | null>(null);
  const [rang, setRang] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('infos');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [data, classement] = await Promise.all([
          fetchSaeById(idSae as string),
          fetchSaeByNote(),
        ]);

        setSae(data);

        if (data && classement.length > 0) {
          const position = classement.findIndex((s) => s.idSae === data.idSae);
          setRang(position >= 0 ? position + 1 : null);
        }
      } catch (e: any) {
        setError(e.message ?? 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idSae]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Détail SAé" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.textSecondary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !sae) {
    return (
      <SafeAreaView style={styles.safe}>
        <BackHeader title="Détail SAé" />
        <View style={styles.centered}>
          <Feather name="alert-circle" size={32} color={Colors.textMuted} />
          <Text style={styles.errorText}>{error ?? 'SAé introuvable'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const noteColor =
    sae.note >= 16 ? Colors.success : sae.note >= 12 ? Colors.warning : Colors.danger;
  const noteBg =
    sae.note >= 16 ? Colors.successBg : sae.note >= 12 ? Colors.warningBg : Colors.dangerBg;

  // Tous les membres de tous les groupes à plat
  const tousLesMembres = sae.groupes.flatMap((g) => g.membres);
  const groupeSize = tousLesMembres.length;
  const galerieSize = sae.images.length;

  const competencesLabel = sae.competences.map((c) => c.codeCompetence).join(', ');

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title={sae.titre} />

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitre} numberOfLines={3}>{sae.titre}</Text>
        <View style={styles.badgesRow}>
          <DomaineBadge domaine={sae.domaine} size="md" />
          <Pill label={sae.anneePromo} />
          <Pill label={sae.semestre} />
        </View>
        <View style={styles.statsRow}>
          <StatItem icon="award" label="Note" value={`${sae.note}/20`} color={noteColor} bg={noteBg} />
          <StatItem icon="check-circle" label="Réussite" value={`${sae.tauxReussite}%`} color={Colors.success} bg={Colors.successBg} />
          <StatItem icon="book-open" label="UE" value={sae.ue || '—'} color={Colors.textSecondary} bg={Colors.surfaceAlt} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TabBtn label="Infos" active={tab === 'infos'} onPress={() => setTab('infos')} />
        <TabBtn
          label={`Groupe${groupeSize > 0 ? ` (${groupeSize})` : ''}`}
          active={tab === 'groupe'}
          onPress={() => setTab('groupe')}
        />
        <TabBtn
          label={`Galerie${galerieSize > 0 ? ` (${galerieSize})` : ''}`}
          active={tab === 'galerie'}
          onPress={() => setTab('galerie')}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ───── ONGLET INFOS ───── */}
        {tab === 'infos' && (
          <View style={styles.tabContent}>
            <InfoSection title="Période" icon="calendar">
              <Text style={styles.infoText}>
                Du <Text style={styles.bold}>{formatDate(sae.dateDebut)}</Text>
                {' '}au <Text style={styles.bold}>{formatDate(sae.dateFin)}</Text>
              </Text>
            </InfoSection>

            {!!sae.description && (
              <InfoSection title="Description" icon="file-text">
                <Text style={styles.infoText}>{sae.description}</Text>
              </InfoSection>
            )}

            {sae.competences.length > 0 && (
              <InfoSection title="Compétences" icon="target">
                <Text style={styles.infoText}>{competencesLabel}</Text>
              </InfoSection>
            )}

            {!!sae.ressourcesHumaines && (
              <InfoSection title="Ressources humaines" icon="users">
                <Text style={styles.infoText}>{sae.ressourcesHumaines}</Text>
              </InfoSection>
            )}

            {(!!sae.lienSite || !!sae.lienProduction) && (
              <InfoSection title="Liens" icon="link">
                <View style={styles.linksCol}>
                  {!!sae.lienSite && (
                    <TouchableOpacity
                      style={styles.linkBtn}
                      onPress={() => Linking.openURL(sae.lienSite)}
                      activeOpacity={0.7}
                    >
                      <Feather name="globe" size={15} color={Colors.textPrimary} />
                      <Text style={styles.linkBtnText}>Site du projet</Text>
                      <Feather name="external-link" size={13} color={Colors.textMuted} style={styles.ml} />
                    </TouchableOpacity>
                  )}
                  {!!sae.lienProduction && (
                    <TouchableOpacity
                      style={styles.linkBtn}
                      onPress={() => Linking.openURL(sae.lienProduction)}
                      activeOpacity={0.7}
                    >
                      <Feather name="code" size={15} color={Colors.textPrimary} />
                      <Text style={styles.linkBtnText}>Code source</Text>
                      <Feather name="external-link" size={13} color={Colors.textMuted} style={styles.ml} />
                    </TouchableOpacity>
                  )}
                </View>
              </InfoSection>
            )}
          </View>
        )}

        {/* ───── ONGLET GROUPE ───── */}
        {tab === 'groupe' && (
          <View style={styles.tabContent}>
            <InfoSection
              title={groupeSize > 0 ? `${groupeSize} membre${groupeSize > 1 ? 's' : ''}` : 'Groupe'}
              icon="users"
            >
              {groupeSize > 0 ? (
                tousLesMembres.map((nom, i) => (
                  <View
                    key={i}
                    style={[styles.membreRow, i < groupeSize - 1 && styles.membreRowBorder]}
                  >
                    <View style={styles.membreAvatar}>
                      <Text style={styles.membreInitial}>
                        {nom.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.membreNom}>{nom}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.infoTextMuted}>Aucun membre renseigné</Text>
              )}
            </InfoSection>

            <InfoSection title="Classement" icon="bar-chart-2">
              <View style={styles.classementRow}>
                <View style={[styles.noteBigBox, { backgroundColor: noteBg }]}>
                  <Text style={[styles.noteBigVal, { color: noteColor }]}>{sae.note}</Text>
                  <Text style={[styles.noteBigUnit, { color: noteColor }]}>/20</Text>
                </View>
                <View style={styles.classementInfo}>
                  {rang !== null && (
                    <View style={styles.classementStatRow}>
                      <Feather name="trending-up" size={14} color={Colors.textMuted} />
                      <Text style={styles.classementStatText}>
                        Rang : <Text style={styles.bold}>#{rang}</Text>
                      </Text>
                    </View>
                  )}
                  <View style={styles.classementStatRow}>
                    <Feather name="check-circle" size={14} color={Colors.success} />
                    <Text style={styles.classementStatText}>
                      Réussite : <Text style={styles.bold}>{sae.tauxReussite}%</Text>
                    </Text>
                  </View>
                  <View style={styles.classementStatRow}>
                    <Feather name="book-open" size={14} color={Colors.textMuted} />
                    <Text style={styles.classementStatText}>
                      UE : <Text style={styles.bold}>{sae.ue || '—'}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </InfoSection>
          </View>
        )}

        {/* ───── ONGLET GALERIE ───── */}
        {tab === 'galerie' && (
          <View style={styles.tabContent}>
            {galerieSize > 0 ? (
              <View style={styles.imageGrid}>
                {sae.images.map((img, idx) => (
                  <TouchableOpacity
                    key={img.idImage}
                    onPress={() => setSelectedImg(img.url)}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: img.url }} style={styles.thumb} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyTab}>
                <Feather name="image" size={28} color={Colors.textMuted} />
                <Text style={styles.emptyTabText}>Aucune illustration disponible</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Lightbox */}
      <Modal visible={!!selectedImg} transparent animationType="fade">
        <TouchableOpacity
          style={styles.lightboxOverlay}
          onPress={() => setSelectedImg(null)}
          activeOpacity={1}
        >
          <TouchableOpacity style={styles.lightboxClose} onPress={() => setSelectedImg(null)}>
            <Feather name="x" size={20} color="#fff" />
          </TouchableOpacity>
          {selectedImg && (
            <Image source={{ uri: selectedImg }} style={styles.lightboxImg} resizeMode="contain" />
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={pillStyles.container}>
      <Text style={pillStyles.text}>{label}</Text>
    </View>
  );
}
const pillStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  text: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
});

function StatItem({
  icon, label, value, color, bg,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.statItem, { backgroundColor: bg }]}>
      <Feather name={icon} size={13} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.tabBtn, active && styles.tabBtnActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function InfoSection({
  title, icon, children,
}: {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoSectionHeader}>
        <Feather name={icon} size={13} color={Colors.textMuted} />
        <Text style={styles.infoSectionTitle}>{title}</Text>
      </View>
      <View style={styles.infoSectionBody}>{children}</View>
    </View>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorText: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center' },

  hero: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heroTitre: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 10,
  },
  badgesRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 14 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statItem: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    gap: 3,
  },
  statValue: { fontSize: 14, fontWeight: '700' },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: Colors.textPrimary },
  tabBtnText: { fontSize: 13, fontWeight: '500', color: Colors.textMuted },
  tabBtnTextActive: { color: Colors.textPrimary, fontWeight: '600' },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  tabContent: { paddingTop: 12, paddingHorizontal: 16, gap: 12 },

  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  infoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  infoSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoSectionBody: { padding: 14 },

  infoText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },
  infoTextMuted: { fontSize: 14, color: Colors.textMuted, fontStyle: 'italic' },
  bold: { fontWeight: '700' },
  ml: { marginLeft: 'auto' },

  linksCol: { gap: 8 },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkBtnText: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },

  membreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  membreRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  membreAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  membreInitial: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  membreNom: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },

  classementRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  noteBigBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 2,
  },
  noteBigVal: { fontSize: 36, fontWeight: '800' },
  noteBigUnit: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  classementInfo: { flex: 1, gap: 8 },
  classementStatRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  classementStatText: { fontSize: 13, color: Colors.textSecondary },

  emptyTab: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 10 },
  emptyTabText: { color: Colors.textMuted, fontSize: 14 },

  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 4 },
  thumb: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
  },

  lightboxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxClose: {
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
  lightboxImg: { width: SCREEN_W, height: SCREEN_W * 1.1 },
});
