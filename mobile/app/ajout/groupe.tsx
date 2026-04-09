import {
  View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator, Alert, Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { createGroupeWork, updateGroupe, fetchAllSae, fetchGroupeById, fetchSaeById } from '@/api/SaeApi';
import { useAuth } from '@/contexts/AuthContext';
import { BackHeader } from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { GroupeWorkFormData, Sae } from '@/types/types';
import { Feather } from '@expo/vector-icons';

const ANNEES = ['MMI2', 'MMI3'];

export default function AjoutGroupeScreen() {
  const router = useRouter();
  const { editId, idSae: paramIdSae } = useLocalSearchParams<{ editId?: string, idSae?: string }>();
  const isEditMode = !!editId;
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saes, setSaes] = useState<Sae[]>([]);
  const [saesLoading, setSaesLoading] = useState(true);
  const [showSaePicker, setShowSaePicker] = useState(false);

  const [form, setForm] = useState<GroupeWorkFormData>({
    idSae: paramIdSae ? parseInt(paramIdSae) : null,
    nomGroupe: '',
    anneePromo: 'MMI2',
    etudiant1: '',
    etudiant2: '',
    etudiant3: '',
    etudiant4: '',
    etudiant5: '',
    note: '',
    lienSite: '',
    lienProduction: '',
    images: [],
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAllSae().then(data => { setSaes(data); setSaesLoading(false); });
  }, []);

  // Pré-remplissage en mode édition
  useEffect(() => {
    if (isEditMode && editId) {
      // On récupère d'abord les infos de base du groupe
      fetchGroupeById(editId).then(groupe => {
        if (!groupe) return;
        
        const newForm: Partial<GroupeWorkFormData> = {
          nomGroupe: groupe.nomGroupe ?? '',
          anneePromo: groupe.anneePromo ?? 'MMI2',
          etudiant1: groupe.etudiant1 ?? '',
          etudiant2: groupe.etudiant2 ?? '',
          etudiant3: groupe.etudiant3 ?? '',
          etudiant4: groupe.etudiant4 ?? '',
          etudiant5: groupe.etudiant5 ?? '',
        };

        // Si on a l'ID de la SAE, on récupère la note et les liens spécifiques
        const saeIdToUse = paramIdSae || form.idSae;
        if (saeIdToUse) {
          fetchSaeById(saeIdToUse).then(sae => {
            if (sae && sae.groupes) {
              const found = sae.groupes.find(g => g.idGroupe.toString() === editId.toString());
              if (found) {
                setForm(prev => ({
                  ...prev,
                  ...newForm,
                  idSae: parseInt(saeIdToUse.toString()),
                  note: found.note ? found.note.toString() : '',
                  // Ces champs peuvent ne pas être dans le DTO actuel, mais on les prévoit
                  lienSite: (found as any).lienSite ?? '',
                  lienProduction: (found as any).lienProduction ?? '',
                  images: (found as any).images ?? [],
                }));
              } else {
                setForm(prev => ({ ...prev, ...newForm }));
              }
            } else {
              setForm(prev => ({ ...prev, ...newForm }));
            }
          });
        } else {
          setForm(prev => ({ ...prev, ...newForm }));
        }
      });
    }
  }, [editId, paramIdSae]);

  const set = (key: keyof GroupeWorkFormData, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // ── Gestion des images ────────────────────────────────────────
  const addImage = () => {
    setForm(prev => ({
      ...prev,
      images: [...prev.images, { url: '', legende: '', ordre: prev.images.length + 1 }],
    }));
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, ordre: i + 1 })),
    }));
  };

  const setImage = (idx: number, field: 'url' | 'legende', value: string) => {
    setForm(prev => {
      const imgs = [...prev.images];
      imgs[idx] = { ...imgs[idx], [field]: value };
      return { ...prev, images: imgs };
    });
  };

  const selectedSae = saes.find(s => s.idSae === form.idSae);

  const handleSubmit = async () => {
    if (!form.idSae) { Alert.alert('Champ requis', 'Veuillez sélectionner une SAÉ.'); return; }
    if (!form.etudiant1.trim()) { Alert.alert('Champ requis', 'Au moins un membre est requis.'); return; }
    if (!form.note.trim() || isNaN(parseFloat(form.note))) {
      Alert.alert('Champ requis', 'La note est obligatoire (ex : 14.5).');
      return;
    }
    
    try {
      setLoading(true);
      let result;
      if (isEditMode && editId) {
        result = await updateGroupe(parseInt(editId), form, user?.token);
        if (!result) { Alert.alert('Erreur', 'Impossible de modifier le groupe.'); return; }
        Alert.alert('Succès', `Groupe « ${form.nomGroupe || 'modifié'} » mis à jour.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        const groupeNum = (selectedSae?.groupes?.length ?? 0) + 1;
        const nomGroupe = `Groupe ${groupeNum}`;
        result = await createGroupeWork({ ...form, nomGroupe }, user?.token);
        if (!result) { Alert.alert('Erreur', 'Impossible d\'ajouter le groupe.'); return; }
        Alert.alert('Succès', `Groupe ajouté à « ${selectedSae?.titre ?? 'la SAÉ'} ».`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Erreur inconnue');
    } finally { setLoading(false); }
  };

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title={isEditMode ? 'Modifier le groupe' : 'Ajouter un groupe'} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Sélection SAÉ */}
        <Field label="SAÉ *">
          <TouchableOpacity style={styles.selector} onPress={() => setShowSaePicker(true)} activeOpacity={0.7}>
            <Feather name="list" size={15} color={selectedSae ? Colors.accent : Colors.textMuted} />
            <Text style={[styles.selectorText, !selectedSae && { color: Colors.textMuted }]} numberOfLines={1}>
              {selectedSae ? selectedSae.titre : 'Sélectionner une SAÉ…'}
            </Text>
            <Feather name="chevron-down" size={15} color={Colors.textMuted} />
          </TouchableOpacity>
        </Field>

        {/* Picker SAÉ */}
        <Modal visible={showSaePicker} transparent animationType="slide">
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Sélectionner une SAÉ</Text>
              <TouchableOpacity onPress={() => setShowSaePicker(false)}>
                <Feather name="x" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {saesLoading
              ? <View style={styles.center}><ActivityIndicator color={Colors.accent} /></View>
              : <ScrollView>
                  {saes.map(sae => (
                    <TouchableOpacity key={sae.idSae}
                      style={[styles.pickerItem, form.idSae === sae.idSae && styles.pickerItemActive]}
                      onPress={() => { set('idSae', sae.idSae); setShowSaePicker(false); }}
                      activeOpacity={0.7}>
                      <Text style={styles.pickerItemText} numberOfLines={2}>{sae.titre}</Text>
                      <Text style={styles.pickerItemMeta}>{sae.anneePromo} · {sae.domaine}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
            }
          </View>
        </Modal>

        <Field label="Année">
          <View style={styles.chipRow}>
            {ANNEES.map(a => (
              <TouchableOpacity key={a} style={[styles.chip, form.anneePromo === a && styles.chipActive]}
                onPress={() => set('anneePromo', a)} activeOpacity={0.7}>
                <Text style={[styles.chipText, form.anneePromo === a && styles.chipTextActive]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>

        {/* Membres */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Membres du groupe</Text>
          {(['etudiant1', 'etudiant2', 'etudiant3', 'etudiant4', 'etudiant5'] as const).map((key, i) => (
            <View key={key} style={styles.membreRow}>
              <View style={styles.membreNum}>
                <Text style={styles.membreNumText}>{i + 1}</Text>
              </View>
              <TextInput style={[styles.input, { flex: 1 }]} value={form[key]}
                onChangeText={v => set(key, v)}
                placeholder={`Prénom NOM${i === 0 ? ' *' : ''}`}
                placeholderTextColor={Colors.textMuted} />
            </View>
          ))}
        </View>

        <Field label="Note (/20) *">
          <TextInput style={styles.input} value={form.note} onChangeText={v => set('note', v)}
            placeholder="Ex : 14.5" placeholderTextColor={Colors.textMuted} keyboardType="decimal-pad" />
        </Field>

        <Field label="Lien vers le site">
          <View style={styles.inputRow}>
            <Feather name="globe" size={15} color={Colors.textMuted} />
            <TextInput style={[styles.input, styles.inputFlex]} value={form.lienSite}
              onChangeText={v => set('lienSite', v)} placeholder="https://…"
              placeholderTextColor={Colors.textMuted} keyboardType="url" autoCapitalize="none" />
          </View>
        </Field>

        <Field label="Code source">
          <View style={styles.inputRow}>
            <Feather name="github" size={15} color={Colors.textMuted} />
            <TextInput style={[styles.input, styles.inputFlex]} value={form.lienProduction}
              onChangeText={v => set('lienProduction', v)} placeholder="https://github.com/…"
              placeholderTextColor={Colors.textMuted} keyboardType="url" autoCapitalize="none" />
          </View>
        </Field>

        {/* Images dynamiques */}
        <View style={styles.field}>
          <View style={styles.imageHeader}>
            <Text style={styles.fieldLabel}>Images du projet ({form.images.length})</Text>
            <TouchableOpacity style={styles.addImageBtn} onPress={addImage} activeOpacity={0.7}>
              <Feather name="plus" size={14} color={Colors.accent} />
              <Text style={styles.addImageText}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          {form.images.length === 0 && (
            <View style={styles.emptyImages}>
              <Feather name="image" size={24} color={Colors.textMuted} />
              <Text style={styles.emptyImagesText}>Aucune image — appuie sur "Ajouter"</Text>
            </View>
          )}

          {form.images.map((img, idx) => (
            <View key={idx} style={styles.imageBlock}>
              <View style={styles.imageBlockHeader}>
                <Text style={styles.imageBlockNum}>Image {idx + 1}</Text>
                <TouchableOpacity onPress={() => removeImage(idx)} hitSlop={8}>
                  <Feather name="trash-2" size={15} color={Colors.danger} />
                </TouchableOpacity>
              </View>
              <TextInput style={styles.input} value={img.url}
                onChangeText={v => setImage(idx, 'url', v)}
                placeholder="URL de l'image (https://…)"
                placeholderTextColor={Colors.textMuted} keyboardType="url" autoCapitalize="none" />
              <TextInput style={[styles.input, { marginTop: 6 }]} value={img.legende}
                onChangeText={v => setImage(idx, 'legende', v)}
                placeholder="Légende (optionnel)"
                placeholderTextColor={Colors.textMuted} />
            </View>
          ))}

          {form.images.length > 0 && (
            <TouchableOpacity style={styles.addMoreBtn} onPress={addImage} activeOpacity={0.7}>
              <Feather name="plus-circle" size={16} color={Colors.accent} />
              <Text style={styles.addMoreText}>Ajouter une image</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={[styles.submitBtn, loading && styles.submitDisabled]}
          onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
          {loading
            ? <ActivityIndicator color={Colors.surface} size="small" />
            : <><Feather name={isEditMode ? "save" : "users"} size={16} color={Colors.surface} /><Text style={styles.submitText}>{isEditMode ? 'Enregistrer les modifications' : 'Ajouter le groupe'}</Text></>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text>{children}</View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 50, gap: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  field: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, color: Colors.textPrimary, fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, gap: 10 },
  inputFlex: { flex: 1, borderWidth: 0, padding: 0, backgroundColor: 'transparent' },

  selector: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, gap: 10 },
  selectorText: { flex: 1, fontSize: 14, color: Colors.textPrimary },

  pickerSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70%', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 10 },
  pickerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  pickerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  pickerItem: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  pickerItemActive: { backgroundColor: Colors.accentLight },
  pickerItemText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  pickerItemMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { borderWidth: 1, borderColor: Colors.borderStrong, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: Colors.surface },
  chipActive: { borderColor: Colors.accent, backgroundColor: Colors.accent },
  chipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: Colors.surface, fontWeight: '600' },

  membreRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  membreNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center' },
  membreNumText: { fontSize: 13, fontWeight: '700', color: Colors.accent },

  imageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addImageBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: Colors.accentLight, borderRadius: 6 },
  addImageText: { fontSize: 12, fontWeight: '600', color: Colors.accent },
  emptyImages: { alignItems: 'center', paddingVertical: 20, gap: 8, backgroundColor: Colors.surfaceAlt, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  emptyImagesText: { fontSize: 13, color: Colors.textMuted },
  imageBlock: { backgroundColor: Colors.surfaceAlt, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10, gap: 8 },
  imageBlockHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  imageBlockNum: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase' },
  addMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: Colors.accent, borderStyle: 'dashed' },
  addMoreText: { fontSize: 14, color: Colors.accent, fontWeight: '600' },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.accent, borderRadius: 10, paddingVertical: 15, marginTop: 8 },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: Colors.surface, fontSize: 15, fontWeight: '600' },
});
