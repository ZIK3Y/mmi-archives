import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  subtitle: string;
  onPress: () => void;
  accent?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, accent }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, accent && styles.menuItemAccent]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, accent && styles.menuIconAccent]}>
        <Feather name={icon} size={20} color={accent ? Colors.surface : Colors.textPrimary} />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, accent && styles.menuLabelAccent]}>{label}</Text>
        <Text style={[styles.menuSub, accent && styles.menuSubAccent]}>{subtitle}</Text>
      </View>
      <Feather
        name="chevron-right"
        size={16}
        color={accent ? 'rgba(255,255,255,0.5)' : Colors.textMuted}
      />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.institution}>IUT MLV Meaux · BUT MMI</Text>
          <Text style={styles.title}>Archive SAé</Text>
          <Text style={styles.subtitle}>
            Historisation et consultation des SAé MMI2 et MMI3
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Explorer</Text>
        <View style={styles.card}>
          <MenuItem
            icon="layers"
            label="Toutes les SAé"
            subtitle="Liste complète avec recherche"
            onPress={() => router.push('/sae')}
          />
          <View style={styles.separator} />
          <MenuItem
            icon="calendar"
            label="Par année"
            subtitle="MMI2 · MMI3"
            onPress={() => router.push('/sae/parAnnee')}
          />
          <View style={styles.separator} />
          <MenuItem
            icon="tag"
            label="Par domaine"
            subtitle="Web, Développement, DI, 3D, Création…"
            onPress={() => router.push('/sae/parDomaine')}
          />
          <View style={styles.separator} />
          <MenuItem
            icon="bar-chart-2"
            label="Classement par note"
            subtitle="SAé triées par note décroissante"
            onPress={() => router.push('/sae/classement')}
          />
          <View style={styles.separator} />
          <MenuItem
            icon="image"
            label="Galerie photos"
            subtitle="Toutes les illustrations des SAé"
            onPress={() => router.push('/sae/galerie')}
          />
        </View>

        <Text style={styles.sectionLabel}>Compte</Text>
        <View style={styles.card}>
          <MenuItem
            icon="log-in"
            label="Se connecter"
            subtitle="Pour ajouter des SAé"
            onPress={() => router.push('/auth/login')}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 40 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
  },
  institution: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    marginBottom: 8,
    marginTop: 8,
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    backgroundColor: Colors.surface,
  },
  menuItemAccent: {
    backgroundColor: Colors.textPrimary,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconAccent: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  menuText: { flex: 1 },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuLabelAccent: { color: Colors.surface },
  menuSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  menuSubAccent: { color: 'rgba(255,255,255,0.6)' },

  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 68,
  },
});
