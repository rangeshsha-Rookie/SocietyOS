import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AIContextCardProps {
  label: string;
  title?: string;
  badge?: string;
  badgeVariant?: 'danger' | 'warning' | 'info' | 'success';
  icon?: keyof typeof Ionicons.glyphMap;
  children?: React.ReactNode;
  style?: ViewStyle;
  highlight?: boolean;
}

export const AIContextCard: React.FC<AIContextCardProps> = ({
  label,
  title,
  badge,
  badgeVariant = 'info',
  icon,
  children,
  style,
  highlight = false,
}) => {
  const getBadgeColors = () => {
    switch (badgeVariant) {
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'info':
      default:
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)' };
    }
  };

  const badgeColors = getBadgeColors();

  return (
    <View
      style={[
        styles.card,
        highlight && styles.highlightCard,
        style,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.labelRow}>
          {icon && (
            <Ionicons
              name={icon}
              size={15}
              color={highlight ? '#38BDF8' : '#94A3B8'}
              style={styles.labelIcon}
            />
          )}
          <Text style={[styles.labelText, highlight && styles.highlightLabelText]}>
            {label.toUpperCase()}
          </Text>
        </View>

        {badge && (
          <View
            style={[
              styles.badgeContainer,
              {
                backgroundColor: badgeColors.bg,
                borderColor: badgeColors.border,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: badgeColors.text }]}>
              {badge}
            </Text>
          </View>
        )}
      </View>

      {title && <Text style={styles.titleText}>{title}</Text>}

      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131C2E',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  highlightCard: {
    backgroundColor: '#101B33',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: 6,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
  },
  highlightLabelText: {
    color: '#38BDF8',
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  content: {
    marginTop: 6,
  },
});
