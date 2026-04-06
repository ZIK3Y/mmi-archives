import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchSaeById } from '@/api/SaeApi';
import { Sae, Groupe } from '@/types/types';
import { Colors } from '@/constants/Colors';
import { BackHeader } from '@/components/BackHeader';
import { Feather } from '@expo/vector-icons';

export default function ProjetGroupeDetail() {
    const { idGroupe, idSae } = useLocalSearchParams();
    const [groupe, setGroupe] = useState<Groupe | null>(null);
    const [sae, setSae] = useState<Sae | null>(null);

    useEffect(() => {
        if (idSae) {
            fetchSaeById(idSae as string).then(data => {
                if (data) {
                    setSae(data);
                    const found = data.groupes.find(g => g.idGroupe.toString() === idGroupe);
                    if (found) setGroupe(found);
                }
            });
        }
    }, [idGroupe, idSae]);

    if (!groupe || !sae) return null;

    return (
        <SafeAreaView style={styles.safe}>
            <BackHeader title={groupe.nomGroupe} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.hero}>
                    <Text style={[styles.tag, { color: Colors.accent }]}>{sae.titre}</Text>
                    <Text style={styles.title}>Réalisation du Groupe</Text>
                    <View style={[styles.noteLarge, { backgroundColor: Colors.accent }]}>
                        <Text style={styles.noteLargeText}>
                            {groupe.note !== undefined ? `${groupe.note}/20` : "Non noté"}
                        </Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: Colors.accent }]}
                        onPress={() => sae.lienSite && Linking.openURL(sae.lienSite)}
                    >
                        <Feather name="globe" size={18} color="white" />
                        <Text style={styles.btnText}>Voir le site</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, { borderColor: Colors.accent, borderWidth: 1 }]}
                        onPress={() => sae.lienProduction && Linking.openURL(sae.lienProduction)}
                    >
                        <Feather name="github" size={18} color={Colors.accent} />
                        <Text style={[styles.btnText, { color: Colors.accent }]}>Code Source</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { color: Colors.accent }]}>Galerie du projet</Text>
                <View style={styles.gallery}>
                    {sae.images && sae.images.map((img, index) => (
                        <Image key={index} source={{ uri: img.url }} style={styles.image} resizeMode="cover" />
                    ))}
                    {(!sae.images || sae.images.length === 0) && (
                        <Text style={styles.empty}>Aucune image disponible pour ce projet.</Text>
                    )}
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
    content: {
        padding: 20
    },
    hero: {
        alignItems: 'center',
        marginBottom: 30
    },
    tag: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 8
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
        textAlign: 'center'
    },
    noteLarge: {
        marginTop: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20
    },
    noteLargeText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30
    },
    btn: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    btnText: {
        color: 'white',
        fontWeight: '700'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15
    },
    gallery: {
        gap: 15
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        backgroundColor: '#DDD'
    },
    empty: {
        color: Colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20
    }
});