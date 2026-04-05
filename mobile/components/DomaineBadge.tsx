import { View, Text, StyleSheet } from 'react-native';
import { DomaineColors, Colors } from '@/constants/Colors';

interface DomaineBadgeProps {
  domaine: string;
  size?: 'sm' | 'md';
}

export function DomaineBadge({ domaine, size = 'sm' }: DomaineBadgeProps) {
  const palette = DomaineColors[domaine] ?? { text: Colors.domaineAutre, bg: '#E8E8E8' };

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, size === 'md' && styles.badgeMd]}>
      <Text style={[styles.text, { color: palette.text }, size === 'md' && styles.textMd]}>
        {domaine}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textMd: {
    fontSize: 13,
  },
});
