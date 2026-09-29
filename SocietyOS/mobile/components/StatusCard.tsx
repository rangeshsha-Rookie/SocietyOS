import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusCardProps {
  label: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  variant?: 'blue' | 'amber' | 'emerald' | 'rose';
  subtitle?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  label,
  value,
  icon,
  variant = 'blue',
  subtitle,
}) => {
  const getColorScheme = () => {
    switch (variant) {
      case 'amber':
        return {
          iconColor: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.12)',
          borderColor: 'rgba(245, 158, 11, 0.25)',
        };
      case 'emerald':
        return {
          iconColor: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
        };
      case 'rose':
        return {
          iconColor: '#F43F5E',
          bgColor: 'rgba(244, 63, 94, 0.12)',
          borderColor: 'rgba(244, 63, 94, 0.25)',
        };
      case 'blue':
      default:
        return {
          iconColor: '#38BDF8',
          bgColor: 'rgba(56, 189, 248, 0.12)',
          borderColor: 'rgba(56, 189, 248, 0.25)',
        };
    }
  };

  const colors = getColorScheme();

  return (
    <View style={[styles.card, { borderColor: colors.borderColor }]}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.bgColor }]}>
        <Ionicons name={icon} size={20} color={colors.iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#131C2E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  content: {
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});
