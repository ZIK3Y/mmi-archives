import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchSaeById } from '@/api/SaeApi';
import { Sae } from '@/types/types';
import { Colors } from '@/constants/Colors';
import { BackHeader } from '@/components/BackHeader';
import { DomaineBadge } from '@/components/DomaineBadge';
import { Feather } from '@expo/vector-icons';

export default function SaeDetailScreen() {
  const { idSae } = useLocalSearchParams();
  const router = useRouter();
  const [sae, setSae] = useState<Sae | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idSae) loadSae();
  }, [idSae]);

  const loadSae = async () => {
    try {
      const data = await fetchSaeById(idSae as string);
      setSae(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.accent} /></View>
  );

  if (!sae) return (
    <View style={styles.center}><Text>SAé introuvable</Text></View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title={sae.titre} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <View style={styles.headerInfo}>
          <DomaineBadge domaine={sae.domaine} size="md" />
          <Text style={styles.description}>{sae.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.accent }]}>Groupes et Résultats</Text>
          {sae.groupes && sae.groupes.map((groupe) => (
            <TouchableOpacity
              key={groupe.idGroupe}
              style={styles.groupeCard}
              onPress={() => router.push({
                pathname: `/sae/projet/${groupe.idGroupe}`,
                params: { idSae: sae.idSae }
              })}
            >
              <View style={styles.groupeHeader}>
                <View style={styles.groupeMain}>
                  <Text style={styles.groupeNom}>{groupe.nomGroupe}</Text>
                  <Text style={styles.membres}>{groupe.membres ? groupe.membres.join(', ') : 'Aucun membre'}</Text>
                </View>
                <View style={[styles.noteBadge, { backgroundColor: Colors.accent }]}>
                  <Text style={styles.noteText}>
                    {(groupe.note !== undefined && groupe.note !== null) ? groupe.note.toFixed(1) : "N/C"}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={[styles.linkText, { color: Colors.accent }]}>Voir le projet et les détails</Text>
                <Feather name="chevron-right" size={16} color={Colors.accent} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scroll: {
    flex: 1
  },
  content: {
    padding: 20
  },
  headerInfo: {
    marginBottom: 24,
    gap: 12
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16
  },
  groupeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  groupeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  groupeMain: {
    flex: 1,
    marginRight: 10
  },
  groupeNom: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  membres: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4
  },
  noteBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 55,
    alignItems: 'center'
  },
  noteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1
  }
});