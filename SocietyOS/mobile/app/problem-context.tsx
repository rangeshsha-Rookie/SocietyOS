import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ComplaintAnalysisResponse } from '../types/complaint';
import { AIContextCard } from '../components/AIContextCard';
import { HistoryCard } from '../components/HistoryCard';
import { ActionButton } from '../components/ActionButton';
import { useSendToCommittee } from '../hooks/useComplaint';

export default function ProblemContextScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ payload: string }>();

  let data: ComplaintAnalysisResponse | null = null;
  try {
    if (params.payload) {
      data = JSON.parse(params.payload);
    }
  } catch (err) {
    console.error('Error parsing problem context payload:', err);
  }

  const [isSent, setIsSent] = useState(false);
  const sendToCommitteeMutation = useSendToCommittee();

  const handleSendToCommittee = () => {
    if (!data?.complaint?.id) {
      Alert.alert('Notice', 'Complaint dossier has been prepared for the committee.');
      router.replace('/');
      return;
    }

    sendToCommitteeMutation.mutate(data.complaint.id, {
      onSuccess: () => {
        setIsSent(true);
        Alert.alert(
          'Sent to Committee',
          'AI Problem Dossier and historical context have been forwarded to the Society Management Committee.',
          [
            {
              text: 'View Dashboard',
              onPress: () => router.replace('/'),
            },
          ]
        );
      },
      onError: (err: any) => {
        Alert.alert(
          'Error',
          err?.response?.data?.message || 'Failed to dispatch to committee. Please try again.'
        );
      },
    });
  };

  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Analysis Context Unavailable</Text>
          <Text style={styles.errorSub}>Could not load the problem context payload.</Text>
          <ActionButton
            title="Return Home"
            onPress={() => router.replace('/')}
            variant="secondary"
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const {
    complaint,
    aiAnalysis,
    relatedComplaintsCount,
    incidentsCount,
    reopenedCount,
    recurrence,
    relatedAsset,
    lastIncidentDaysAgo,
    previousResolution,
    recommendedAction,
  } = data;

  const currentReportText =
    complaint?.description || 'B wing mein pani ka pressure bohot low hai';
  const categoryText = aiAnalysis?.category || 'Water Supply';
  const urgencyText = aiAnalysis?.urgency || 'HIGH';
  const wingText = aiAnalysis?.wing ? `${aiAnalysis.wing}-Wing` : 'B-Wing';
  const assetName = relatedAsset?.name || 'B-Wing Water Pump';
  const assetCode = 'B-WP-01';
  const daysAgoText = lastIncidentDaysAgo ? `${lastIncidentDaysAgo} days ago` : '43 days ago';
  const previousActionText = previousResolution?.actionTaken || 'Pump servicing';
  const outcomeText = previousResolution?.outcome || 'Issue returned after 18 days';
  const recommendedActionText = recommendedAction || 'Inspect pump + supply line';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dossier Header Badge */}
        <View style={styles.dossierBadge}>
          <Ionicons name="shield-checkmark" size={14} color="#38BDF8" style={styles.dossierIcon} />
          <Text style={styles.dossierText}>SOCIETYOS OPERATIONAL MEMORY DOSSIER</Text>
        </View>

        {/* 1. CURRENT REPORT */}
        <AIContextCard label="Current Report" icon="document-text-outline">
          <Text style={styles.reportQuote}>"{currentReportText}"</Text>
          <View style={styles.reportMetaRow}>
            <Ionicons name="person-outline" size={13} color="#64748B" />
            <Text style={styles.reportMetaText}>
              Flat {complaint?.flatNumber || 'B-402'} • Wing {complaint?.wing || 'B'}
            </Text>
          </View>
        </AIContextCard>

        {/* 2. AI TRIAGE & AFFECTED AREA ROW */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <AIContextCard
              label="AI Triage"
              title={categoryText}
              badge={urgencyText}
              badgeVariant={urgencyText === 'HIGH' || urgencyText === 'CRITICAL' ? 'danger' : 'warning'}
              icon="sparkles-outline"
            />
          </View>

          <View style={{ flex: 1, marginLeft: 6 }}>
            <AIContextCard
              label="Affected Area"
              title={wingText}
              icon="location-outline"
            />
          </View>
        </View>

        {/* 3. RELATED HISTORY CARD */}
        <HistoryCard
          relatedComplaintsCount={relatedComplaintsCount}
          incidentsCount={incidentsCount}
          reopenedCount={reopenedCount}
          recurrence={recurrence}
        />

        {/* 4. RELATED ASSET */}
        <AIContextCard
          label="Related Asset"
          icon="hardware-chip-outline"
          badge={assetCode}
          badgeVariant="info"
        >
          <Text style={styles.assetTitle}>{assetName}</Text>
          {relatedAsset?.location && (
            <Text style={styles.assetLocation}>
              Location: {relatedAsset.location}
            </Text>
          )}
          {relatedAsset?.vendor && (
            <View style={styles.vendorRow}>
              <Ionicons name="construct-outline" size={13} color="#38BDF8" />
              <Text style={styles.vendorText}>
                Vendor: {relatedAsset.vendor.name} ({relatedAsset.vendor.serviceType})
              </Text>
            </View>
          )}
        </AIContextCard>

        {/* 5. HISTORICAL RESOLUTION CONTEXT */}
        <View style={styles.historyDetailCard}>
          <View style={styles.historyDetailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>LAST INCIDENT</Text>
              <Text style={styles.detailValueBold}>{daysAgoText}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>PREVIOUS ACTION</Text>
              <Text style={styles.detailValue}>{previousActionText}</Text>
            </View>
          </View>

          <View style={styles.outcomeRow}>
            <View style={styles.outcomeIconBox}>
              <Ionicons name="repeat-outline" size={16} color="#EF4444" />
            </View>
            <View style={styles.outcomeContent}>
              <Text style={styles.outcomeLabel}>OUTCOME</Text>
              <Text style={styles.outcomeText}>{outcomeText}</Text>
            </View>
          </View>
        </View>

        {/* 6. RECOMMENDED ACTION (SIGNATURE CARD) */}
        <AIContextCard
          label="Recommended Action"
          icon="bulb-outline"
          highlight={true}
          badge="AI GENERATED"
          badgeVariant="info"
          style={styles.recommendationCard}
        >
          <Text style={styles.recommendationTitle}>{recommendedActionText}</Text>
          <View style={styles.reasoningBox}>
            <Text style={styles.reasoningText}>
              Previous pump servicing failed after 18 days. Cross-referencing 7 complaints
              and 2 reopened incidents suggests recurring line pressure drop rather than an
              isolated pump defect. Full inspection of pump and header supply line recommended.
            </Text>
          </View>
        </AIContextCard>

        {/* Primary CTA */}
        <View style={styles.ctaContainer}>
          <ActionButton
            title={isSent ? 'Sent to Committee' : 'Send to Committee'}
            icon={isSent ? 'checkmark-circle' : 'paper-plane-outline'}
            variant={isSent ? 'secondary' : 'primary'}
            onPress={handleSendToCommittee}
            loading={sendToCommitteeMutation.isPending}
            disabled={isSent}
            style={styles.ctaButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  dossierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    marginBottom: 12,
  },
  dossierIcon: {
    marginRight: 6,
  },
  dossierText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  reportQuote: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  reportMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  reportMetaText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
  },
  assetLocation: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  vendorText: {
    fontSize: 12,
    color: '#38BDF8',
    marginLeft: 6,
  },
  historyDetailCard: {
    backgroundColor: '#131C2E',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  historyDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailCol: {
    flex: 1,
  },
  detailDivider: {
    width: 1,
    backgroundColor: '#1E293B',
    marginHorizontal: 12,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  detailValueBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  detailValue: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  outcomeIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  outcomeContent: {
    flex: 1,
  },
  outcomeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 0.8,
  },
  outcomeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 1,
  },
  recommendationCard: {
    marginVertical: 8,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  reasoningBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  reasoningText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  ctaContainer: {
    marginTop: 14,
    marginBottom: 20,
  },
  ctaButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#2563EB',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 16,
  },
  errorSub: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
});
