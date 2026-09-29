import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HistoryCardProps {
  relatedComplaintsCount: number;
  incidentsCount: number;
  reopenedCount: number;
  recurrence: string;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  relatedComplaintsCount,
  incidentsCount,
  reopenedCount,
  recurrence,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="time-outline" size={16} color="#38BDF8" style={styles.headerIcon} />
          <Text style={styles.headerLabel}>RELATED HISTORY</Text>
        </View>
        <View style={[styles.recurrencePill, recurrence === 'HIGH' ? styles.highPill : styles.medPill]}>
          <Text style={[styles.recurrenceText, recurrence === 'HIGH' ? styles.highText : styles.medText]}>
            {recurrence} RECURRENCE
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{relatedComplaintsCount}</Text>
          <Text style={styles.metricLabel}>related complaints</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{incidentsCount}</Text>
          <Text style={styles.metricLabel}>incidents</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: '#EF4444' }]}>{reopenedCount}</Text>
          <Text style={styles.metricLabel}>reopened</Text>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 6,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
  },
  recurrencePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  highPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  medPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  recurrenceText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  highText: {
    color: '#EF4444',
  },
  medText: {
    color: '#F59E0B',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#1E293B',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
});
