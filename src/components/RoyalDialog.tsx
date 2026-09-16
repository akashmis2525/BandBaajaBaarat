import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export interface RoyalDialogProps {
  visible: boolean;
  type?: 'success' | 'warning' | 'info' | 'error' | 'royal';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  highlightText?: string;
}

export const RoyalDialog: React.FC<RoyalDialogProps> = ({
  visible,
  type = 'royal',
  title,
  message,
  confirmText = 'Got It',
  cancelText,
  onConfirm,
  onCancel,
  highlightText,
}) => {
  if (!visible) return null;

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle' as const,
          color: '#10B981',
          bgColor: '#ECFDF5',
          borderColor: '#A7F3D0',
        };
      case 'warning':
        return {
          icon: 'warning' as const,
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          borderColor: '#FDE68A',
        };
      case 'error':
        return {
          icon: 'alert-circle' as const,
          color: '#EF4444',
          bgColor: '#FEF2F2',
          borderColor: '#FECACA',
        };
      case 'info':
        return {
          icon: 'information-circle' as const,
          color: '#3B82F6',
          bgColor: '#EFF6FF',
          borderColor: '#BFDBFE',
        };
      case 'royal':
      default:
        return {
          icon: 'sparkles' as const,
          color: '#8A072D',
          bgColor: '#FFF1F2',
          borderColor: '#FECDD3',
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialogCard}>
          {/* Top Floating Themed Icon */}
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: iconConfig.bgColor,
                borderColor: iconConfig.borderColor,
              },
            ]}
          >
            <Ionicons name={iconConfig.icon} size={30} color={iconConfig.color} />
          </View>

          {/* Title */}
          <Text style={styles.dialogTitle}>{title}</Text>

          {/* Decorative Subtle Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerHeart}>♡</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Message */}
          <Text style={styles.dialogMessage}>{message}</Text>

          {/* Optional Highlight Box */}
          {highlightText ? (
            <View style={styles.highlightBox}>
              <Ionicons name="shield-checkmark" size={14} color="#8A072D" style={{ marginRight: 6 }} />
              <Text style={styles.highlightText}>{highlightText}</Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            {cancelText && onCancel && (
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !cancelText && styles.confirmButtonFull,
              ]}
              activeOpacity={0.88}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: Math.min(width - 48, 380),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FECDD3',
  },
  dividerHeart: {
    fontSize: 11,
    color: '#D81B60',
    marginHorizontal: 6,
  },
  dialogMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    width: '100%',
  },
  highlightText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A072D',
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmButton: {
    flex: 1.3,
    backgroundColor: '#8A072D',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmButtonFull: {
    flex: 1,
  },
  confirmButtonText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
