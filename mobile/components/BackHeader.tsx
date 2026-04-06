import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

interface BackHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export function BackHeader({ title, rightAction }: BackHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
        <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightAction ? rightAction : <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
});
