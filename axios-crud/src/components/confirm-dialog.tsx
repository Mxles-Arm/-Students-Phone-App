import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { radius, spacing, ThemeColors, TOUCH_MIN, typography, useTheme } from "../theme";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Alert.alert's multi-button form is a no-op on web (React Native Web
 * renders it as a plain console.log), so destructive confirmations need
 * a real component that behaves the same on every platform.
 */
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      {/* RN Web's Modal wraps content in a pointer-events:none box so background
          clicks pass through; re-enable it here or every control inside is dead. */}
      <View style={styles.scrim} pointerEvents="auto">
        <Pressable
          style={[StyleSheet.absoluteFill, styles.dismiss]}
          onPress={onCancel}
          accessibilityLabel="Dismiss"
        />

        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="alert-circle-outline" size={28} color={colors.danger} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnGhostPressed]}
            >
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              style={({ pressed }) => [styles.btn, styles.btnDanger, pressed && styles.btnDangerPressed]}
            >
              <Text style={styles.btnDangerText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  dismiss: {
    // Sits behind the card so it only catches taps on the backdrop itself.
    zIndex: 0,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
    // Must outrank the absolutely-positioned dismiss overlay, otherwise
    // it can paint on top and swallow taps meant for Cancel/Delete.
    zIndex: 1,
    elevation: 1,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.dangerSurface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: "center",
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  btn: {
    flex: 1,
    minHeight: TOUCH_MIN,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },
  btnGhost: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnGhostPressed: {
    backgroundColor: colors.surfacePressed,
  },
  btnGhostText: {
    ...typography.label,
    color: colors.text,
  },
  btnDanger: {
    backgroundColor: colors.danger,
  },
  btnDangerPressed: {
    opacity: 0.85,
  },
  btnDangerText: {
    ...typography.label,
    color: colors.onPrimary,
  },
  });
}
