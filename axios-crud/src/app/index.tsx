import Card from "@/components/card";
import api from "@/utils/crud-api";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadow, spacing, TOUCH_MIN, typography } from "../theme";

type Phone = {
  id: string;
  name: string;
  sect: string;
  tel: string;
};

export default function Index() {
  const [data, setData] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    try {
      const response = await api.get("phones");
      setData(response.data);
      setError(null);
    } catch (err) {
      console.log("ERROR", err);
      setError("Could not load contacts. Check that the server is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refetch whenever the screen regains focus, so returning from
  // add/edit shows the updated list without a manual refresh.
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [getData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Icon
            source={error ? "wifi-off" : "account-multiple-outline"}
            size={32}
            color={colors.textMuted}
          />
        </View>
        <Text style={styles.emptyTitle}>
          {error ? "Can't reach the server" : "No contacts yet"}
        </Text>
        <Text style={styles.emptyText}>
          {error ?? "Add your first contact to get started."}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Student Phones</Text>
          <Text style={styles.subtitle}>
            {loading
              ? "Loading…"
              : `${data.length} ${data.length === 1 ? "contact" : "contacts"}`}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/addPhone")}
          accessibilityRole="button"
          accessibilityLabel="Add phone"
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        >
          <Icon source="plus" size={20} color={colors.onPrimary} />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Card phone={item} refresh={getData} />}
          contentContainerStyle={[
            styles.listContent,
            data.length === 0 && styles.listContentEmpty,
          ]}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: TOUCH_MIN,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    ...shadow.card,
  },
  addBtnPressed: {
    backgroundColor: colors.primaryPressed,
  },
  addBtnText: {
    ...typography.label,
    color: colors.onPrimary,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});
