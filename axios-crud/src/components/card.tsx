import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing, TOUCH_MIN, typography } from "../theme";
import api from "../utils/crud-api";

type Phone = {
  id: string;
  name: string;
  sect: string;
  tel: string;
};

type Props = {
  phone: Phone;
  refresh: () => void;
};

/** Initials avatar — gives each row a stable visual anchor. */
function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials || "?"}</Text>
    </View>
  );
}

export default function Card({ phone, refresh }: Props) {
  const [deleting, setDeleting] = useState(false);

  const delPhone = async () => {
    setDeleting(true);
    try {
      await api.delete("phones/" + phone.id);
      refresh();
    } catch (err) {
      console.log(err);
      Alert.alert("Delete failed", "Could not delete this contact. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Destructive actions need confirmation before they run.
  const confirmDelete = () => {
    Alert.alert(
      "Delete contact?",
      `"${phone.name}" will be permanently removed.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: delPhone },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.card}>
      <Avatar name={phone.name} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {phone.name}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{phone.sect}</Text>
          </View>
          <Text style={styles.tel} numberOfLines={1}>
            {phone.tel}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Link
          href={{
            pathname: "/editPhone",
            params: {
              id: phone.id,
              name: phone.name,
              sect: phone.sect,
              tel: phone.tel,
            },
          }}
          push
          asChild
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit ${phone.name}`}
            hitSlop={6}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          >
            <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.primary} />
          </Pressable>
        </Link>

        <Pressable
          onPress={confirmDelete}
          disabled={deleting}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${phone.name}`}
          accessibilityState={{ disabled: deleting }}
          hitSlop={6}
          style={({ pressed }) => [
            styles.iconBtn,
            styles.iconBtnDanger,
            pressed && styles.iconBtnDangerPressed,
            deleting && styles.iconBtnDisabled,
          ]}
        >
          {deleting ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.badgeBg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...typography.label,
    color: colors.badgeText,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.badgeBg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.badgeText,
  },
  tel: {
    ...typography.caption,
    color: colors.textMuted,
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconBtn: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  iconBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  iconBtnDanger: {
    backgroundColor: colors.dangerSurface,
  },
  iconBtnDangerPressed: {
    opacity: 0.7,
  },
  iconBtnDisabled: {
    opacity: 0.5,
  },
});
