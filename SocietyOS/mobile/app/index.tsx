import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHomeComplaints, useDefaultResident } from '../hooks/useComplaint';
import { StatusCard } from '../components/StatusCard';
import { ComplaintCard } from '../components/ComplaintCard';
import { ActionButton } from '../components/ActionButton';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  const {
    data: complaintsData,
    isLoading: isComplaintsLoading,
    isRefetching,
    refetch,
    error: complaintsError,
  } = useHomeComplaints();

  const { data: residentData } = useDefaultResident();
  const resident = residentData?.resident;

  const onRefresh = () => {
    refetch();
  };

  const handleReportProblem = () => {
    router.push('/complaint');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor="#38BDF8"
            colors={['#38BDF8']}
          />
        }
      >
        {/* Header & Branding */}
        <View style={styles.header}>
          <View style={styles.brandingRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="business" size={20} color="#38BDF8" />
            </View>
            <View>
              <Text style={styles.brandTitle}>SocietyOS</Text>
              <Text style={styles.brandSubtitle}>Intelligent Operational Memory</Text>
            </View>
          </View>

          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Live Node</Text>
          </View>
        </View>

        {/* Resident Greeting Card */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingLeft}>
            <Text style={styles.greetingSub}>RESIDENT DASHBOARD</Text>
            <Text style={styles.greetingName}>
              {resident ? resident.name : 'Aarav Sharma'}
            </Text>
            <View style={styles.unitBadge}>
              <Ionicons name="home-outline" size={13} color="#94A3B8" />
              <Text style={styles.unitText}>
                Flat {resident?.flatNumber || 'B-402'} • Wing {resident?.wing || 'B'}
              </Text>
            </View>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {resident ? resident.name.split(' ').map((n) => n[0]).join('') : 'AS'}
            </Text>
          </View>
        </View>

        {/* Primary CTA */}
        <View style={styles.primaryActionSection}>
          <ActionButton
            title="Report a Problem"
            icon="add-circle"
            variant="primary"
            onPress={handleReportProblem}
            style={styles.primaryCtaButton}
          />
        </View>

        {/* Status Metrics Cards */}
        <View style={styles.metricsContainer}>
          <StatusCard
            label="Active Issues"
            value={complaintsData?.stats?.active ?? '...'}
            icon="alert-circle-outline"
            variant="blue"
          />
          <StatusCard
            label="Open Incidents"
            value={complaintsData?.stats?.openIncidents ?? '...'}
            icon="warning-outline"
            variant="amber"
          />
          <StatusCard
            label="Resolved"
            value={complaintsData?.stats?.resolved ?? '...'}
            icon="checkmark-done-circle-outline"
            variant="emerald"
          />
        </View>

        {/* Tabs for Active vs Resolved Complaints */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('active')}
            style={[styles.tabButton, activeTab === 'active' && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active Complaints ({complaintsData?.activeComplaints?.length ?? 0})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('resolved')}
            style={[styles.tabButton, activeTab === 'resolved' && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeTab === 'resolved' && styles.activeTabText]}>
              Resolved ({complaintsData?.resolvedComplaints?.length ?? 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Complaints List Section */}
        {isComplaintsLoading && !isRefetching ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#38BDF8" />
            <Text style={styles.loadingText}>Syncing society registry...</Text>
          </View>
        ) : complaintsError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={36} color="#EF4444" />
            <Text style={styles.errorTitle}>Unable to connect to SocietyOS node</Text>
            <Text style={styles.errorSub}>Please check backend connectivity</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry Sync</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listSection}>
            {activeTab === 'active' ? (
              complaintsData?.activeComplaints && complaintsData.activeComplaints.length > 0 ? (
                complaintsData.activeComplaints.map((item) => (
                  <ComplaintCard key={item.id} complaint={item} />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="checkmark-circle-outline" size={40} color="#10B981" />
                  <Text style={styles.emptyTitle}>All Society Systems Operational</Text>
                  <Text style={styles.emptySub}>No open complaints in your wings right now.</Text>
                </View>
              )
            ) : complaintsData?.resolvedComplaints && complaintsData.resolvedComplaints.length > 0 ? (
              complaintsData.resolvedComplaints.map((item) => (
                <ComplaintCard key={item.id} complaint={item} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="file-tray-outline" size={40} color="#64748B" />
                <Text style={styles.emptyTitle}>No Resolved History Yet</Text>
              </View>
            )}
          </View>
        )}
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  greetingCard: {
    backgroundColor: '#131C2E',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  greetingLeft: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  unitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitText: {
    fontSize: 13,
    color: '#94A3B8',
    marginLeft: 6,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#38BDF8',
  },
  primaryActionSection: {
    marginBottom: 14,
  },
  primaryCtaButton: {
    backgroundColor: '#2563EB',
    height: 54,
    borderRadius: 14,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#131C2E',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#1E293B',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#F8FAFC',
  },
  listSection: {
    marginTop: 4,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 13,
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#131C2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  errorTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  errorSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  retryButtonText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#131C2E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
});
