import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { createSae } from '@/api/SaeApi';
import { useAuth } from '@/contexts/AuthContext';
import { BackHeader } from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { SaeFormData } from '@/types/types';
import { Feather } from '@expo/vector-icons';

const ANNEES = ['MMI2', 'MMI3'];
const DOMAINES = ['Web', 'Développement', 'DI', '3D', 'Création', 'Autre'];
const SEMESTRES = ['S3', 'S4', 'S5', 'S6'];

export default function AjoutSaeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirection si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  const [form, setForm] = useState<SaeFormData>({
    titre: '',
    description: '',
    semestre: 'S3',
    annee: 'MMI2',
    domaine: 'Web',
    competences: '',
    ressourcesHumaines: '',
    dateDebut: '',
    dateFin: '',
    note: 0,
    tauxReussite: 0,
    ue: '',
    lienSite: '',
    lienProduction: '',
  });

  const set = (key: keyof SaeFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.titre.trim()) {
      Alert.alert('Champ requis', 'Le titre de la SAé est obligatoire.');
      return;
    }
    try {
      setLoading(true);
      const result = await createSae(form, user?.token);
      if (!result) {
        Alert.alert('Erreur', 'Impossible de créer la SAé. Vérifiez la connexion au serveur.');
        return;
      }
      Alert.alert('Succès', `SAé « ${result.titre} » créée avec succès.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="Ajouter une SAé" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="Titre *">
          <TextInput
            style={styles.input}
            value={form.titre}
            onChangeText={(v) => set('titre', v)}
            placeholder="Ex : SAé 3.01 — Site web MMI"
            placeholderTextColor={Colors.textMuted}
          />
        </Field>

        <Field label="Description">
          <TextInput
            style={[styles.input, styles.textarea]}
            value={form.description}
            onChangeText={(v) => set('description', v)}
            placeholder="Contexte et objectifs du projet…"
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
          />
        </Field>

        <Field label="Année">
          <ChipGroup
            options={ANNEES}
            value={form.annee}
            onChange={(v) => set('annee', v)}
          />
        </Field>

        <Field label="Semestre">
          <ChipGroup
            options={SEMESTRES}
            value={form.semestre}
            onChange={(v) => set('semestre', v)}
          />
        </Field>

        <Field label="Domaine">
          <ChipGroup
            options={DOMAINES}
            value={form.domaine}
            onChange={(v) => set('domaine', v)}
            wrap
          />
        </Field>

        <Field label="Compétences">
          <TextInput
            style={styles.input}
            value={form.competences}
            onChangeText={(v) => set('competences', v)}
            placeholder="Ex : AC21.01, AC22.03…"
            placeholderTextColor={Colors.textMuted}
          />
        </Field>

        <Field label="UE correspondante">
          <TextInput
            style={styles.input}
            value={form.ue}
            onChangeText={(v) => set('ue', v)}
            placeholder="Ex : UE3.1"
            placeholderTextColor={Colors.textMuted}
          />
        </Field>

        <Field label="Ressources humaines">
          <TextInput
            style={styles.input}
            value={form.ressourcesHumaines}
            onChangeText={(v) => set('ressourcesHumaines', v)}
            placeholder="Intervenants, tuteurs…"
            placeholderTextColor={Colors.textMuted}
          />
        </Field>

        <View style={styles.row}>
          <View style={styles.rowField}>
            <Field label="Date de début">
              <TextInput
                style={styles.input}
                value={form.dateDebut}
                onChangeText={(v) => set('dateDebut', v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textMuted}
              />
            </Field>
          </View>
          <View style={styles.rowField}>
            <Field label="Date de fin">
              <TextInput
                style={styles.input}
                value={form.dateFin}
                onChangeText={(v) => set('dateFin', v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textMuted}
              />
            </Field>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.rowField}>
            <Field label="Note (/20)">
              <TextInput
                style={styles.input}
                value={form.note === 0 ? '' : String(form.note)}
                onChangeText={(v) => set('note', parseFloat(v) || 0)}
                placeholder="Ex : 15.5"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
          <View style={styles.rowField}>
            <Field label="Taux réussite (%)">
              <TextInput
                style={styles.input}
                value={form.tauxReussite === 0 ? '' : String(form.tauxReussite)}
                onChangeText={(v) => set('tauxReussite', parseFloat(v) || 0)}
                placeholder="Ex : 85"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
        </View>

        <Field label="Lien vers le site">
          <View style={styles.inputRow}>
            <Feather name="globe" size={15} color={Colors.textMuted} />
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={form.lienSite}
              onChangeText={(v) => set('lienSite', v)}
              placeholder="https://…"
              placeholderTextColor={Colors.textMuted}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </Field>

        <Field label="Lien vers le code source">
          <View style={styles.inputRow}>
            <Feather name="code" size={15} color={Colors.textMuted} />
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={form.lienProduction}
              onChangeText={(v) => set('lienProduction', v)}
              placeholder="https://github.com/…"
              placeholderTextColor={Colors.textMuted}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </Field>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.surface} size="small" />
          ) : (
            <>
              <Feather name="save" size={16} color={Colors.surface} />
              <Text style={styles.submitText}>Enregistrer la SAé</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
  wrap = false,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  wrap?: boolean;
}) {
  return (
    <View style={[styles.chipGroup, wrap && styles.chipGroupWrap]}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, value === opt && styles.chipActive]}
          onPress={() => onChange(opt)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 50, gap: 14 },

  field: { gap: 6 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  textarea: {
    minHeight: 88,
    textAlignVertical: 'top',
    paddingTop: 11,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 10,
  },
  inputFlex: {
    flex: 1,
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },

  row: { flexDirection: 'row', gap: 10 },
  rowField: { flex: 1 },

  chipGroup: { flexDirection: 'row', gap: 8 },
  chipGroupWrap: { flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  chipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: Colors.surface, fontWeight: '600' },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 8,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: Colors.surface, fontSize: 15, fontWeight: '600' },
});
