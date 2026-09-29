import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAnalyzeComplaint } from '../hooks/useComplaint';
import { ComplaintAnalysisResponse } from '../types/complaint';

interface Step {
  id: number;
  label: string;
}

const STEPS: Step[] = [
  { id: 1, label: 'Understanding your complaint...' },
  { id: 2, label: 'Searching society history...' },
  { id: 3, label: 'Building problem context...' },
];

export default function ProcessingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    description: string;
    wing: string;
    flatNumber: string;
    photoUri?: string;
  }>();

  const [activeStep, setActiveStep] = useState(1);
  const [apiResult, setApiResult] = useState<ComplaintAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const analyzeMutation = useAnalyzeComplaint();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Trigger backend AI analysis & memory retrieval
    analyzeMutation.mutate(
      {
        description: params.description || '',
        wing: params.wing || 'B',
        flatNumber: params.flatNumber || 'B-402',
        photoUri: params.photoUri || undefined,
      },
      {
        onSuccess: (data) => {
          setApiResult(data);
        },
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message ||
              err?.message ||
              'Unable to process complaint. Please ensure SocietyOS node is online.'
          );
        },
      }
    );
  }, []);

  // Step progression animation (short, professional)
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setActiveStep(2);
    }, 400);

    const timer2 = setTimeout(() => {
      setActiveStep(3);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // When step 3 reached and API result is available, navigate to problem-context
  useEffect(() => {
    if (activeStep >= 3 && apiResult) {
      const navigationTimeout = setTimeout(() => {
        router.replace({
          pathname: '/problem-context',
          params: {
            payload: JSON.stringify(apiResult),
          },
        });
      }, 400);

      return () => clearTimeout(navigationTimeout);
    }
  }, [activeStep, apiResult]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Pulsing Central Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircleOuter}>
            <View style={styles.iconCircleInner}>
              <Ionicons name="hardware-chip" size={36} color="#38BDF8" />
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>SocietyOS Operational Engine</Text>
        <Text style={styles.subtitle}>
          Correlating telemetry with society infrastructure memory
        </Text>

        {/* Steps List */}
        <View style={styles.stepsContainer}>
          {STEPS.map((step) => {
            const isCompleted = activeStep > step.id || (activeStep === 3 && apiResult !== null);
            const isCurrent = activeStep === step.id && !isCompleted;
            const isPending = activeStep < step.id;

            return (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepIndicator}>
                  {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  ) : isCurrent ? (
                    <ActivityIndicator size="small" color="#38BDF8" />
                  ) : (
                    <View style={styles.pendingCircle} />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isCompleted && styles.stepLabelCompleted,
                    isCurrent && styles.stepLabelCurrent,
                    isPending && styles.stepLabelPending,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Error Fallback */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 24,
  },
  iconCircleOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 16,
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: '#131C2E',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  stepIndicator: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pendingCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#475569',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  stepLabelCompleted: {
    color: '#10B981',
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  stepLabelPending: {
    color: '#475569',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
});
