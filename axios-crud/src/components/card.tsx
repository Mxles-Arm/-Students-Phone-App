import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { radius, shadow, spacing, ThemeColors, TOUCH_MIN, typography, useTheme } from "../theme";
import api from "../utils/crud-api";
import ConfirmDialog from "./confirm-dialog";

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
function Avatar({ name, styles }: { name: string; styles: Styles }) {
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
  const { colors, getSectionColors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const sectionColors = getSectionColors(phone.sect);
  const [deleting, setDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const callPhone = async () => {
    // Strip formatting — some dialers reject "tel:" URLs containing dashes/spaces.
    const url = `tel:${phone.tel.replace(/[^\d+]/g, "")}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert("Can't place call", "This device has no phone app available.");
      return;
    }
    Linking.openURL(url);
  };

  const delPhone = async () => {
    setConfirmVisible(false);
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

  return (
    <View style={styles.card}>
      <Avatar name={phone.name} styles={styles} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {phone.name}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: sectionColors.bg }]}>
            <Text style={[styles.badgeText, { color: sectionColors.text }]}>{phone.sect}</Text>
          </View>
          <Pressable
            onPress={callPhone}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Call ${phone.name}`}
            style={({ pressed }) => [styles.telRow, pressed && styles.telRowPressed]}
          >
            <MaterialCommunityIcons name="phone-outline" size={13} color={colors.primary} />
            <Text style={styles.tel} numberOfLines={1}>
              {phone.tel}
            </Text>
          </Pressable>
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
          // The anchor Link renders on web shrinks to its content, which would
          // drop the button below the 44pt minimum touch target.
          style={styles.linkReset}
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
          onPress={() => setConfirmVisible(true)}
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

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete contact?"
        message={`"${phone.name}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={delPhone}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
  telRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
    paddingVertical: spacing.xs,
  },
  telRowPressed: {
    opacity: 0.6,
  },
  tel: {
    ...typography.caption,
    color: colors.primary,
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  linkReset: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
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
}

type Styles = ReturnType<typeof makeStyles>;
