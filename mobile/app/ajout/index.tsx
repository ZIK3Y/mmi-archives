import {
  View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator, Alert, Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  createSae, updateSae, fetchAllUes, fetchAllCompetences, fetchAllDomaines, fetchSaeById,
} from '@/api/SaeApi';
import { useAuth } from '@/contexts/AuthContext';
import { BackHeader } from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { SaeFormData, Ue, Competence, Domaine } from '@/types/types';
import { Feather } from '@expo/vector-icons';

const ANNEES = ['MMI2', 'MMI3'];

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS_FR = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

function ueLabel(ue: Ue): string {
  const code = ue.codeUe.replace('UE', 'UE ');
  const keyword = ue.libelle.split(/[\s—]/)[0];
  return `${code} ${keyword}`;
}

function CalendarPicker({ value, onChange, onClose }: {
  value: string; onChange: (v: string) => void; onClose: () => void;
}) {
  const initDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const [selected, setSelected] = useState(value || '');

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${mm}-${dd}`;
    setSelected(dateStr);
    onChange(dateStr);
    onClose();
  };

  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity style={cal.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={cal.box}>
          <View style={cal.header}>
            <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
              <Feather name="chevron-left" size={18} color={Colors.accent} />
            </TouchableOpacity>
            <Text style={cal.headerText}>{MONTHS_FR[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
              <Feather name="chevron-right" size={18} color={Colors.accent} />
            </TouchableOpacity>
          </View>
          <View style={cal.weekRow}>
            {DAYS_FR.map((d, i) => <Text key={i} style={cal.weekDay}>{d}</Text>)}
          </View>
          <View style={cal.grid}>
            {cells.map((day, i) => {
              if (!day) return <View key={`e${i}`} style={cal.cell} />;
              const mm = String(viewMonth + 1).padStart(2, '0');
              const dd = String(day).padStart(2, '0');
              const isSelected = selected === `${viewYear}-${mm}-${dd}`;
              return (
                <TouchableOpacity key={day} style={[cal.cell, isSelected && cal.cellSelected]} onPress={() => handleDay(day)}>
                  <Text style={[cal.cellText, isSelected && cal.cellTextSelected]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={cal.cancelBtn} onPress={onClose}>
            <Text style={cal.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const display = value
    ? new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Sélectionner une date';
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Feather name="calendar" size={15} color={value ? Colors.accent : Colors.textMuted} />
        <Text style={[styles.dateBtnText, !value && { color: Colors.textMuted }]}>{display}</Text>
      </TouchableOpacity>
      {open && <CalendarPicker value={value} onChange={onChange} onClose={() => setOpen(false)} />}
    </View>
  );
}

export default function AjoutSaeScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditMode = !!editId;
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ues, setUes] = useState<Ue[]>([]);
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [domaines, setDomaines] = useState<Domaine[]>([]);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated]);

  const [form, setForm] = useState<SaeFormData>({
    titre: '',
    description: '',
    anneePromo: 'MMI2',
    domaineId: null,
    ueIds: [],
    competenceIds: [],
    ressourcesHumaines: '',
    dateDebut: '',
    dateFin: '',
    lienSite: '',
    lienProduction: '',
  });

  useEffect(() => {
    fetchAllUes().then(setUes);
    fetchAllCompetences().then(setCompetences);
    fetchAllDomaines().then(setDomaines);
  }, []);

  // Pré-remplissage en mode édition
  useEffect(() => {
    if (isEditMode && editId && ues.length > 0 && domaines.length > 0) {
      fetchSaeById(editId).then(sae => {
        if (!sae) return;

        // Trouver l'ID du domaine par son libellé
        const dom = domaines.find(d => d.libelle === sae.domaine);

        // Trouver les IDs des UEs par leur code
        // Note: sae.ue semble être un seul code (ex: "UE1.1") dans le DTO actuel
        const selectedUe = ues.find(u => u.codeUe === sae.ue);

        setForm({
          titre: sae.titre ?? '',
          description: sae.description ?? '',
          anneePromo: sae.anneePromo ?? 'MMI2',
          domaineId: dom ? dom.idDomaine : null,
          ueIds: selectedUe ? [selectedUe.idUe] : [],
          competenceIds: (sae.competences ?? []).map(c => c.idCompetence),
          ressourcesHumaines: sae.ressourcesHumaines ?? '',
          dateDebut: sae.dateDebut ?? '',
          dateFin: sae.dateFin ?? '',
          lienSite: sae.lienSite ?? '',
          lienProduction: sae.lienProduction ?? '',
        });
      });
    }
  }, [editId, ues, domaines]);

  const set = (key: keyof SaeFormData, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleUe = (id: number) => {
    setForm(prev => ({
      ...prev,
      ueIds: prev.ueIds.includes(id)
        ? prev.ueIds.filter(u => u !== id)
        : [...prev.ueIds, id],
    }));
  };

  const toggleCompetence = (id: number) => {
    setForm(prev => ({
      ...prev,
      competenceIds: prev.competenceIds.includes(id)
        ? prev.competenceIds.filter(c => c !== id)
        : [...prev.competenceIds, id],
    }));
  };

  const handleSubmit = async () => {
    if (!form.titre.trim()) { Alert.alert('Champ requis', 'Le titre est obligatoire.'); return; }
    try {
      setLoading(true);
      let result;
      if (isEditMode && editId) {
        result = await updateSae(parseInt(editId), form, user?.token);
        if (!result) { Alert.alert('Erreur', 'Impossible de modifier la SAÉ.'); return; }
        Alert.alert('Succès', `SAÉ « ${result.titre} » modifiée.`, [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        result = await createSae(form, user?.token);
        if (!result) { Alert.alert('Erreur', 'Impossible de créer la SAÉ. Vérifiez la connexion au serveur.'); return; }
        Alert.alert('Succès', `SAÉ « ${result.titre} » créée avec succès.`, [{ text: 'OK', onPress: () => router.back() }]);
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Erreur inconnue');
    } finally { setLoading(false); }
  };

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title={isEditMode ? 'Modifier la SAÉ' : 'Ajouter une SAÉ'} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <Field label="Titre *">
          <TextInput style={styles.input} value={form.titre} onChangeText={v => set('titre', v)}
            placeholder="Ex : SAÉ 3.01 — Site web MMI" placeholderTextColor={Colors.textMuted} />
        </Field>

        <Field label="Description">
          <TextInput style={[styles.input, styles.textarea]} value={form.description}
            onChangeText={v => set('description', v)} placeholder="Contexte et objectifs du projet…"
            placeholderTextColor={Colors.textMuted} multiline numberOfLines={4} />
        </Field>

        <Field label="Année">
          <ChipGroup options={ANNEES} value={form.anneePromo} onChange={v => set('anneePromo', v)} />
        </Field>

        <Field label="Domaine">
          {domaines.length === 0
            ? <Text style={styles.loadingHint}>Chargement…</Text>
            : <ChipGroup
              options={domaines.map(d => d.libelle)}
              value={domaines.find(d => d.idDomaine === form.domaineId)?.libelle ?? ''}
              onChange={v => set('domaineId', domaines.find(d => d.libelle === v)?.idDomaine ?? null)}
              wrap
            />
          }
        </Field>

        <Field label="UE correspondantes (sélection multiple)">
          {ues.length === 0
            ? <Text style={styles.loadingHint}>Chargement…</Text>
            : <View style={[styles.chipGroup, styles.chipGroupWrap]}>
              {ues.map(ue => {
                const active = form.ueIds.includes(ue.idUe);
                return (
                  <TouchableOpacity key={ue.idUe}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleUe(ue.idUe)} activeOpacity={0.7}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {ueLabel(ue)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          }
        </Field>

        <Field label="Compétences">
          {competences.length === 0
            ? <Text style={styles.loadingHint}>Chargement…</Text>
            : <View style={[styles.chipGroup, styles.chipGroupWrap]}>
              {competences.map(c => {
                const active = form.competenceIds.includes(c.idCompetence);
                return (
                  <TouchableOpacity key={c.idCompetence}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleCompetence(c.idCompetence)} activeOpacity={0.7}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {c.libelle}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          }
        </Field>

        <Field label="Ressources humaines">
          <TextInput style={styles.input} value={form.ressourcesHumaines}
            onChangeText={v => set('ressourcesHumaines', v)}
            placeholder="Intervenants, tuteurs…" placeholderTextColor={Colors.textMuted} />
        </Field>

        <DateField label="Date de début" value={form.dateDebut} onChange={v => set('dateDebut', v)} />
        <DateField label="Date de fin" value={form.dateFin} onChange={v => set('dateFin', v)} />

        <TouchableOpacity style={[styles.submitBtn, loading && styles.submitDisabled]}
          onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
          {loading
            ? <ActivityIndicator color={Colors.surface} size="small" />
            : <>
              <Feather name="save" size={16} color={Colors.surface} />
              <Text style={styles.submitText}>
                {isEditMode ? 'Enregistrer les modifications' : 'Enregistrer la SAÉ'}
              </Text>
            </>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text>{children}</View>;
}

function ChipGroup({ options, value, onChange, wrap = false }: {
  options: string[]; value: string; onChange: (v: string) => void; wrap?: boolean;
}) {
  return (
    <View style={[styles.chipGroup, wrap && styles.chipGroupWrap]}>
      {options.map(opt => (
        <TouchableOpacity key={opt} style={[styles.chip, value === opt && styles.chipActive]}
          onPress={() => onChange(opt)} activeOpacity={0.7}>
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
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, color: Colors.textPrimary, fontSize: 14 },
  textarea: { minHeight: 88, textAlignVertical: 'top', paddingTop: 11 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, gap: 10 },
  inputFlex: { flex: 1, borderWidth: 0, padding: 0, backgroundColor: 'transparent' },
  loadingHint: { color: Colors.textMuted, fontStyle: 'italic', fontSize: 13 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, gap: 10 },
  dateBtnText: { flex: 1, fontSize: 14, color: Colors.textPrimary },
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

const cal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  box: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, width: '100%', maxWidth: 360 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { padding: 8 },
  headerText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: Colors.textMuted, paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  cellSelected: { backgroundColor: Colors.accent, borderRadius: 100 },
  cellText: { fontSize: 14, color: Colors.textPrimary },
  cellTextSelected: { color: '#fff', fontWeight: '700' },
  cancelBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: Colors.textMuted, fontSize: 14 },
});
