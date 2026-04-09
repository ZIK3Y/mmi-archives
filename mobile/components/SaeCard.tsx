import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sae } from '@/types/types';
import { Colors } from '@/constants/Colors';
import { DomaineBadge } from './DomaineBadge';
import { Feather } from '@expo/vector-icons';

interface SaeCardProps {
  sae: Sae;
  showRank?: boolean;
  rank?: number;
  isHighest?: boolean;
}

export function SaeCard({ sae, showRank, rank, isHighest }: SaeCardProps) {
  const router = useRouter();

  const noteColor = isHighest
    ? Colors.success
    : sae.note < 10
    ? Colors.danger
    : Colors.warning;

  const noteBg = isHighest
    ? Colors.successBg
    : sae.note < 10
    ? Colors.dangerBg
    : Colors.warningBg;

  const tauxAffiche = parseFloat(sae.tauxReussite.toFixed(2));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/sae/[idSae]', params: { idSae: sae.idSae } })}
      activeOpacity={0.7}
    >
      {showRank && rank !== undefined && (
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>
      )}

      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={2}>{sae.titre}</Text>
            <Text style={styles.meta}>{sae.anneePromo} · {sae.semestre} · {sae.ue}</Text>
          </View>
        </View>
        <View style={[styles.notePill, { backgroundColor: noteBg }]}>
          <Text style={[styles.noteText, { color: noteColor }]}>{sae.note.toFixed(2)}/20</Text>
        </View>
      </View>

      {!!sae.description && (
        <Text style={styles.description} numberOfLines={2}>{sae.description}</Text>
      )}

      <View style={styles.bottomRow}>
        <DomaineBadge domaine={sae.domaine} />
        <View style={styles.tauxRow}>
          <Feather name="check-circle" size={12} color={Colors.success} />
          <Text style={styles.taux}>{tauxAffiche}%</Text>
        </View>
        <Feather name="chevron-right" size={14} color={Colors.accent} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  rankBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentLight,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 8,
  },
  rankText: { fontSize: 11, fontWeight: '700', color: Colors.accent },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  titleBlock: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  title: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, lineHeight: 21 },
  meta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  notePill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  noteText: { fontSize: 13, fontWeight: '700' },
  description: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tauxRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  taux: { fontSize: 12, color: Colors.success, fontWeight: '500' },
  chevron: { marginLeft: 'auto' },
});
