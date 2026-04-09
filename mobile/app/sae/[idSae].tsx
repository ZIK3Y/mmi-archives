import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator, Alert,
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

export default function SaeDetailScreen() {
  const { idSae } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [sae, setSae] = useState<Sae | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idSae) loadSae();
  }, [idSae]);

  const loadSae = async () => {
    try {
      const data = await fetchSaeById(idSae as string);
      setSae(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSae = () => {
    if (!sae) return;
    Alert.alert(
      'Supprimer la SAÉ',
      `Supprimer « ${sae.titre} » ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            const ok = await deleteSae(sae.idSae, user?.token);
            if (ok) {
              Alert.alert('Succès', 'SAÉ supprimée.', [{ text: 'OK', onPress: () => router.back() }]);
            } else {
              Alert.alert('Erreur', 'Impossible de supprimer la SAÉ.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteGroupe = (idGroupe: number, nomGroupe: string) => {
    Alert.alert(
      'Supprimer le groupe',
      `Supprimer « ${nomGroupe } » ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            const ok = await deleteGroupe(idGroupe, user?.token);
            if (ok) {
              setSae(prev => prev ? { ...prev, groupes: prev.groupes.filter(g => g.idGroupe !== idGroupe) } : prev);
            } else {
              Alert.alert('Erreur', 'Impossible de supprimer le groupe.');
            }
          },
        },
      ]
    );
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.accent} /></View>
  );

  if (!sae) return (
    <View style={styles.center}><Text>SAÉ introuvable</Text></View>
  );

  const notes = (sae.groupes ?? []).map(g => g.note ?? 0).filter(n => n > 0);
  const maxNote = notes.length > 0 ? Math.max(...notes) : -1;

  const adminActions = isAuthenticated ? (
    <View style={styles.adminRow}>
      <TouchableOpacity
        style={styles.adminBtn}
        onPress={() => router.push({ pathname: '/ajout', params: { editId: sae.idSae } })}
        hitSlop={8}
      >
        <Feather name="edit-2" size={16} color={Colors.accent} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.adminBtn} onPress={handleDeleteSae} hitSlop={8}>
        <Feather name="trash-2" size={16} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  ) : undefined;

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title={sae.titre} rightAction={adminActions} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <View style={styles.headerInfo}>
          <DomaineBadge domaine={sae.domaine} size="md" />
          <Text style={styles.description}>{sae.description}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Feather name="check-circle" size={12} color={Colors.success} />
              <Text style={styles.statText}>{sae.tauxReussite.toFixed(2)}% de réussite</Text>
            </View>
            {!!sae.ue && (
              <View style={styles.statPill}>
                <Feather name="book" size={12} color={Colors.accent} />
                <Text style={styles.statText}>{sae.ue}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.accent }]}>Groupes et Résultats</Text>
          {(sae.groupes ?? []).map((groupe, idx) => {
            const gNote = groupe.note ?? 0;
            const nColor = noteColorFn(gNote, maxNote);
            const nBg = noteBgFn(gNote, maxNote);
            const groupeLabel = groupe.nomGroupe ?? `Groupe ${idx + 1}`;
            return (
              <View key={groupe.idGroupe} style={styles.groupeCard}>
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: `/sae/projet/${groupe.idGroupe}`,
                    params: { idSae: sae.idSae },
                  })}
                  activeOpacity={0.7}
                >
                  <View style={styles.groupeHeader}>
                    <View style={styles.groupeMain}>
                      <Text style={styles.groupeNom}>{groupeLabel}</Text>
                      <Text style={styles.membres}>
                        {groupe.membres?.join(', ') || 'Aucun membre'}
                      </Text>
                    </View>
                    <View style={[styles.noteBadge, { backgroundColor: nBg }]}>
                      <Text style={[styles.noteText, { color: nColor }]}>
                        {gNote > 0 ? gNote.toFixed(2) : 'N/C'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={[styles.linkText, { color: Colors.accent }]}>Voir le projet et les détails</Text>
                    <Feather name="chevron-right" size={16} color={Colors.accent} />
                  </View>
                </TouchableOpacity>

                {isAuthenticated && (
                  <View style={styles.groupeAdminRow}>
                    <TouchableOpacity
                      style={styles.groupeAdminBtn}
                      onPress={() => router.push({ pathname: '/ajout/groupe', params: { editId: groupe.idGroupe, idSae: sae.idSae } })}
                    >
                      <Feather name="edit-2" size={13} color={Colors.accent} />
                      <Text style={[styles.groupeAdminText, { color: Colors.accent }]}>Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.groupeAdminBtn}
                      onPress={() => handleDeleteGroupe(groupe.idGroupe, groupeLabel)}
                    >
                      <Feather name="trash-2" size={13} color={Colors.danger} />
                      <Text style={[styles.groupeAdminText, { color: Colors.danger }]}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

          {isAuthenticated && (
            <TouchableOpacity
              style={styles.addGroupeBtn}
              onPress={() => router.push({ pathname: '/ajout/groupe', params: { idSae: sae.idSae } })}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={16} color={Colors.accent} />
              <Text style={styles.addGroupeText}>Ajouter un groupe</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  adminRow: { flexDirection: 'row', gap: 4 },
  adminBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

  headerInfo: { marginBottom: 24, gap: 12 },
  description: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },
  statsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },

  groupeCard: { backgroundColor: Colors.surface, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  groupeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, paddingBottom: 8 },
  groupeMain: { flex: 1, marginRight: 10 },
  groupeNom: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  membres: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  noteBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, minWidth: 60, alignItems: 'center' },
  noteText: { fontWeight: 'bold', fontSize: 14 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, paddingTop: 4 },
  linkText: { fontSize: 13, fontWeight: '600', flex: 1 },

  groupeAdminRow: { flexDirection: 'row', gap: 0, borderTopWidth: 1, borderTopColor: Colors.border },
  groupeAdminBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9 },
  groupeAdminText: { fontSize: 13, fontWeight: '500' },

  addGroupeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: Colors.accent, borderStyle: 'dashed', borderRadius: 10, paddingVertical: 12 },
  addGroupeText: { fontSize: 14, color: Colors.accent, fontWeight: '600' },
});
