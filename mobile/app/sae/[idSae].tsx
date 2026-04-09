import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchSaeById, deleteSae, deleteGroupe } from '@/api/SaeApi';
import { Sae } from '@/types/types';
import { Colors } from '@/constants/Colors';
import { BackHeader } from '@/components/BackHeader';
import { DomaineBadge } from '@/components/DomaineBadge';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

function noteColorFn(note: number, maxNote: number) {
  if (note === maxNote) return Colors.success;
  if (note < 10) return Colors.danger;
  return Colors.warning;
}

function noteBgFn(note: number, maxNote: number) {
  if (note === maxNote) return Colors.successBg;
  if (note < 10) return Colors.dangerBg;
  return Colors.warningBg;
}

function roundNote(n: number) {
  return parseFloat(n.toFixed(2));
}

function noteColor(n: number) {
  return n >= 16 ? Colors.success : n >= 12 ? Colors.warning : Colors.danger;
}
function noteBg(n: number) {
  return n >= 16 ? Colors.successBg : n >= 12 ? Colors.warningBg : Colors.dangerBg;
}

function formatDate(d: string) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return d; }
}

export default function SaeDetailScreen() {
  const { idSae } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [sae, setSae] = useState<Sae | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idSae) return;
    fetchSaeById(idSae as string)
      .then(data => setSae(data))
      .catch(e => setError(e.message ?? 'Erreur'))
      .finally(() => setLoading(false));
  }, [idSae]);

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="Détail SAé" />
      <View style={styles.center}><ActivityIndicator size="large" color={Colors.accent} /></View>
    </SafeAreaView>
  );

  if (error || !sae) return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="Détail SAé" />
      <View style={styles.center}>
        <Feather name="alert-circle" size={32} color={Colors.textMuted} />
        <Text style={styles.errorText}>{error ?? 'SAé introuvable'}</Text>
      </View>
    </SafeAreaView>
  );

  const moyenneNote = roundNote(sae.note);
  const groupes = sae.groupes ?? [];
  const competencesLabel = (sae.competences ?? []).map(c => c.codeCompetence).join(', ');

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title={sae.titre} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.badgesRow}>
            <DomaineBadge domaine={sae.domaine} size="md" />
            <View style={styles.pill}><Text style={styles.pillText}>{sae.anneePromo}</Text></View>
            <View style={styles.pill}><Text style={styles.pillText}>{sae.semestre}</Text></View>
          </View>
          <Text style={styles.heroTitre}>{sae.titre}</Text>
          {!!sae.description && (
            <Text style={styles.heroDesc}>{sae.description}</Text>
          )}
        </View>

        {/* Stats globales */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: noteBg(sae.note) }]}>
            <Feather name="award" size={14} color={noteColor(sae.note)} />
            <Text style={[styles.statVal, { color: noteColor(sae.note) }]}>{moyenneNote}/20</Text>
            <Text style={styles.statLbl}>Moy. note</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: Colors.successBg }]}>
            <Feather name="check-circle" size={14} color={Colors.success} />
            <Text style={[styles.statVal, { color: Colors.success }]}>{sae.tauxReussite}%</Text>
            <Text style={styles.statLbl}>Réussite</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: Colors.accentLight }]}>
            <Feather name="book-open" size={14} color={Colors.accent} />
            <Text style={[styles.statVal, { color: Colors.accent }]}>{sae.ue || '—'}</Text>
            <Text style={styles.statLbl}>UE</Text>
          </View>
        </View>

        {/* Infos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={13} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Informations</Text>
          </View>
          <View style={styles.infoGrid}>
            <InfoRow icon="calendar" label="Période" value={`${formatDate(sae.dateDebut)} → ${formatDate(sae.dateFin)}`} />
            {!!competencesLabel && <InfoRow icon="target" label="Compétences" value={competencesLabel} />}
            {!!sae.ressourcesHumaines && <InfoRow icon="users" label="Ressources" value={sae.ressourcesHumaines} />}
            {!!sae.lienSite && <InfoRow icon="globe" label="Site" value={sae.lienSite} />}
            {!!sae.lienProduction && <InfoRow icon="code" label="Code source" value={sae.lienProduction} />}
          </View>
        </View>

        {/* Groupes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="users" size={13} color={Colors.accent} />
            <Text style={styles.sectionTitle}>
              {groupes.length} groupe{groupes.length > 1 ? 's' : ''}
            </Text>
          </View>

          {groupes.length === 0 ? (
            <Text style={styles.emptyText}>Aucun groupe renseigné</Text>
          ) : (
            groupes.map((groupe, idx) => {
              const gNote = roundNote(groupe.note ?? 0);
              return (
                <TouchableOpacity
                  key={groupe.idGroupe}
                  style={styles.groupeCard}
                  activeOpacity={0.7}
                  onPress={() => router.push({
                    pathname: '/sae/projet/[idGroupe]',
                    params: { idGroupe: groupe.idGroupe, idSae: sae.idSae },
                  })}
                >
                  <View style={styles.groupeLeft}>
                    <View style={styles.groupeNum}>
                      <Text style={styles.groupeNumText}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.groupeNom}>{groupe.nomGroupe}</Text>
                      <Text style={styles.groupeMembres} numberOfLines={1}>
                        {(groupe.membres ?? []).join(' · ') || 'Aucun membre'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.groupeRight}>
                    <View style={[styles.groupeNotePill, { backgroundColor: noteBg(gNote) }]}>
                      <Text style={[styles.groupeNoteText, { color: noteColor(gNote) }]}>{gNote}/20</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={Colors.accent} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Feather name={icon} size={13} color={Colors.accent} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorText: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center' },

  hero: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  badgesRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: { backgroundColor: Colors.accentLight, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontSize: 11, color: Colors.accent, fontWeight: '600' },
  heroTitre: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, lineHeight: 26 },
  heroDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statBox: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statVal: { fontSize: 15, fontWeight: '800' },
  statLbl: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },

  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  infoGrid: { padding: 14, gap: 12 },
  infoRow: { flexDirection: 'row', gap: 10 },
  infoLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },

  emptyText: { padding: 16, color: Colors.textMuted, fontStyle: 'italic', fontSize: 14 },

  groupeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  groupeLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  groupeNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupeNumText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
  groupeNom: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  groupeMembres: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  groupeRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupeNotePill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  groupeNoteText: { fontSize: 13, fontWeight: '700' },
});
