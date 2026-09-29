import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Complaint } from '../types/complaint';

interface ComplaintCardProps {
  complaint: Complaint;
  onPress?: () => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onPress,
}) => {
  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    switch (category.toLowerCase()) {
      case 'water supply':
        return 'water-outline';
      case 'elevator':
        return 'swap-vertical-outline';
      case 'electrical':
        return 'flash-outline';
      case 'cleanliness':
        return 'trash-outline';
      case 'security':
        return 'shield-checkmark-outline';
      default:
        return 'construct-outline';
    }
  };

  const getUrgencyBadge = () => {
    switch (complaint.urgency) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          text: '#EF4444',
          label: complaint.urgency,
        };
      case 'MEDIUM':
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          text: '#F59E0B',
          label: 'MED',
        };
      case 'LOW':
      default:
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          text: '#10B981',
          label: 'LOW',
        };
    }
  };

  const getStatusBadge = () => {
    switch (complaint.status) {
      case 'RESOLVED':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          text: '#10B981',
          label: 'Resolved',
        };
      case 'REOPENED':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          text: '#F87171',
          label: 'Reopened',
        };
      case 'COMMITTEE_REVIEW':
        return {
          bg: 'rgba(139, 92, 246, 0.15)',
          text: '#A78BFA',
          label: 'In Committee',
        };
      default:
        return {
          bg: 'rgba(56, 189, 248, 0.12)',
          text: '#38BDF8',
          label: 'Active',
        };
    }
  };

  const urgency = getUrgencyBadge();
  const status = getStatusBadge();
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.categoryRow}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={getCategoryIcon(complaint.category)}
              size={16}
              color="#38BDF8"
            />
          </View>
          <Text style={styles.categoryText}>{complaint.category}</Text>
        </View>

        <View style={styles.badges}>
          <View style={[styles.badgePill, { backgroundColor: urgency.bg }]}>
            <Text style={[styles.badgeText, { color: urgency.text }]}>
              {urgency.label}
            </Text>
          </View>
          <View style={[styles.badgePill, { backgroundColor: status.bg, marginLeft: 6 }]}>
            <Text style={[styles.badgeText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {complaint.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color="#64748B" />
          <Text style={styles.locationText}>
            Wing {complaint.wing} • {complaint.flatNumber}
          </Text>
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131C2E',
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
  },
});
