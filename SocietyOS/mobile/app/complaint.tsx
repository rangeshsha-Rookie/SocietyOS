import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { ActionButton } from '../components/ActionButton';

const ComplaintFormSchema = z.object({
  description: z.string().min(5, 'Please provide more details (at least 5 characters)'),
  wing: z.string().min(1, 'Wing is required'),
  flatNumber: z.string().min(2, 'Flat number is required'),
});

export default function RaiseComplaintScreen() {
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [wing, setWing] = useState('B');
  const [flatNumber, setFlatNumber] = useState('B-402');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const sampleDemoPrompt = 'B wing mein pani ka pressure bohot low hai';

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission required',
          'Camera roll permissions are required to attach evidence photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Image picker error:', err);
    }
  };

  const removePhoto = () => {
    setPhotoUri(null);
  };

  const handleApplyDemoPrompt = () => {
    setDescription(sampleDemoPrompt);
    setWing('B');
    setFlatNumber('B-402');
    setErrors({});
  };

  const handleAnalyze = () => {
    try {
      ComplaintFormSchema.parse({
        description: description.trim(),
        wing: wing.trim(),
        flatNumber: flatNumber.trim(),
      });
      setErrors({});

      // Navigate to processing screen with state parameters
      router.push({
        pathname: '/processing',
        params: {
          description: description.trim(),
          wing: wing.trim().toUpperCase(),
          flatNumber: flatNumber.trim(),
          photoUri: photoUri || '',
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0].toString()] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Instructions */}
        <View style={styles.infoBanner}>
          <Ionicons name="sparkles" size={18} color="#38BDF8" style={styles.bannerIcon} />
          <Text style={styles.bannerText}>
            SocietyOS will cross-reference your complaint with society operational memory,
            assets, and historical recurrence.
          </Text>
        </View>

        {/* Demo Test Chip */}
        <View style={styles.demoSection}>
          <Text style={styles.demoLabel}>QUICK TEST PROMPT</Text>
          <TouchableOpacity
            style={styles.demoChip}
            activeOpacity={0.7}
            onPress={handleApplyDemoPrompt}
          >
            <Ionicons name="flash" size={14} color="#F59E0B" />
            <Text style={styles.demoChipText}>"{sampleDemoPrompt}"</Text>
          </TouchableOpacity>
        </View>

        {/* Complaint Description Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PROBLEM DESCRIPTION *</Text>
          <TextInput
            style={[styles.textArea, Boolean(errors.description) && styles.inputError]}
            placeholder="Describe what's wrong (e.g. B wing mein pani ka pressure bohot low hai)..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={(val) => {
              setDescription(val);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Wing and Flat Row */}
        <View style={styles.row}>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.fieldLabel}>WING *</Text>
            <TextInput
              style={[styles.input, Boolean(errors.wing) && styles.inputError]}
              placeholder="e.g. B"
              placeholderTextColor="#64748B"
              autoCapitalize="characters"
              maxLength={2}
              value={wing}
              onChangeText={(val) => {
                setWing(val);
                if (errors.wing) setErrors((prev) => ({ ...prev, wing: '' }));
              }}
            />
            {errors.wing && <Text style={styles.errorText}>{errors.wing}</Text>}
          </View>

          <View style={[styles.fieldGroup, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>FLAT NUMBER *</Text>
            <TextInput
              style={[styles.input, Boolean(errors.flatNumber) && styles.inputError]}
              placeholder="e.g. B-402"
              placeholderTextColor="#64748B"
              value={flatNumber}
              onChangeText={(val) => {
                setFlatNumber(val);
                if (errors.flatNumber) setErrors((prev) => ({ ...prev, flatNumber: '' }));
              }}
            />
            {errors.flatNumber && <Text style={styles.errorText}>{errors.flatNumber}</Text>}
          </View>
        </View>

        {/* Photo Attachment (Expo Image Picker) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ATTACH EVIDENCE PHOTO (OPTIONAL)</Text>
          {photoUri ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                activeOpacity={0.8}
                onPress={removePhoto}
              >
                <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                <Text style={styles.removePhotoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadBox}
              activeOpacity={0.8}
              onPress={pickImage}
            >
              <Ionicons name="camera-outline" size={28} color="#38BDF8" />
              <Text style={styles.uploadText}>Select photo from camera / gallery</Text>
              <Text style={styles.uploadSubtext}>Supports JPG, PNG up to 10MB</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Primary CTA */}
        <View style={styles.ctaContainer}>
          <ActionButton
            title="Analyze Complaint"
            icon="analytics-outline"
            variant="primary"
            onPress={handleAnalyze}
            disabled={description.trim().length === 0}
            style={styles.analyzeButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101B33',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    marginBottom: 16,
  },
  bannerIcon: {
    marginRight: 10,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  demoSection: {
    marginBottom: 16,
  },
  demoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 6,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131C2E',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoChipText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: '#131C2E',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  textArea: {
    minHeight: 110,
    backgroundColor: '#131C2E',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#1E293B',
    lineHeight: 22,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
  },
  uploadBox: {
    height: 110,
    backgroundColor: '#131C2E',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  uploadText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadSubtext: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  photoPreviewContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    backgroundColor: '#131C2E',
  },
  photoPreview: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  removePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 10,
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  ctaContainer: {
    marginTop: 10,
  },
  analyzeButton: {
    backgroundColor: '#2563EB',
    height: 54,
  },
});
