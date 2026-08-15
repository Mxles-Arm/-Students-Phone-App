import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ActivityIndicator,
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { radius, spacing, ThemeColors, TOUCH_MIN, typography, useTheme } from "../theme";

/** Labelled text input with the error message anchored to the field. */
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType,
  autoCapitalize = "none",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !!error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
      />
      {!!error && (
        <View style={styles.errorRow}>
          <MaterialCommunityIcons name="alert-circle-outline" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

/** Icon-prefixed search box with a clear button — distinct from TextField, which always shows a label. */
export function SearchField({
  value,
  onChangeText,
  placeholder = "Search",
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.searchWrap}>
      <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const SECTIONS = ["CED", "TCT"] as const;

/** Segmented choice — larger tap area and clearer state than a radio row. */
export function SectionPicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Section</Text>
      <View style={[styles.segment, !!error && styles.inputError]}>
        {SECTIONS.map((option) => {
          const selected = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Section ${option}`}
              style={({ pressed }) => [
                styles.segmentItem,
                selected && styles.segmentItemActive,
                pressed && !selected && styles.segmentItemPressed,
              ]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && (
        <View style={styles.errorRow}>
          <MaterialCommunityIcons name="alert-circle-outline" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const FILTER_OPTIONS = ["All", ...SECTIONS] as const;
export type SectionFilterValue = (typeof FILTER_OPTIONS)[number];

/** Segmented filter — same tap ergonomics as SectionPicker, but non-exclusive (has an "All" state). */
export function SectionFilter({
  value,
  onChange,
}: {
  value: SectionFilterValue;
  onChange: (value: SectionFilterValue) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.segment}>
      {FILTER_OPTIONS.map((option) => {
        const selected = value === option;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Filter ${option}`}
            style={({ pressed }) => [
              styles.segmentItem,
              selected && styles.segmentItemActive,
              pressed && !selected && styles.segmentItemPressed,
            ]}
          >
            <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Sticky action bar: primary action on the right, following platform convention. */
export function FormActions({
  onCancel,
  onSubmit,
  submitLabel,
  submitting,
}: {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.actions}>
      <Pressable
        onPress={onCancel}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        style={({ pressed }) => [
          styles.btn,
          styles.btnGhost,
          pressed && styles.btnGhostPressed,
          submitting && styles.btnDisabled,
        ]}
      >
        <Text style={styles.btnGhostText}>Cancel</Text>
      </Pressable>

      <Pressable
        onPress={onSubmit}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
        accessibilityState={{ disabled: !!submitting }}
        style={({ pressed }) => [
          styles.btn,
          styles.btnPrimary,
          pressed && styles.btnPrimaryPressed,
          submitting && styles.btnDisabled,
        ]}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <Text style={styles.btnPrimaryText}>{submitLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  input: {
    minHeight: TOUCH_MIN,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
    ...typography.body,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: TOUCH_MIN,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: colors.text,
    ...typography.body,
  },
  segment: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  segmentItem: {
    flex: 1,
    minHeight: TOUCH_MIN,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm - 2,
  },
  segmentItemActive: {
    backgroundColor: colors.primary,
  },
  segmentItemPressed: {
    backgroundColor: colors.surfacePressed,
  },
  segmentText: {
    ...typography.label,
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.onPrimary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
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
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnPrimaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  btnPrimaryText: {
    ...typography.label,
    color: colors.onPrimary,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  });
}
