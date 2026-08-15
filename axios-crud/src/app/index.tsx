import Card from "@/components/card";
import api from "@/utils/crud-api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchField, SectionFilter, SectionFilterValue } from "../components/form-controls";
import { radius, shadow, spacing, ThemeColors, TOUCH_MIN, typography, useTheme } from "../theme";
import { useThemeMode } from "../theme-context";

type Phone = {
  id: string;
  name: string;
  sect: string;
  tel: string;
};

export default function Index() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { mode, toggleMode } = useThemeMode();
  const [data, setData] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<SectionFilterValue>("All");

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

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((phone) => {
      const matchesSection = sectionFilter === "All" || phone.sect === sectionFilter;
      const matchesQuery =
        normalizedQuery === "" ||
        phone.name.toLowerCase().includes(normalizedQuery) ||
        phone.tel.includes(normalizedQuery);
      return matchesSection && matchesQuery;
    });
  }, [data, query, sectionFilter]);

  const hasActiveFilters = query.trim() !== "" || sectionFilter !== "All";

  const renderEmpty = () => {
    if (loading) return null;

    if (error) {
      return (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="wifi-off" size={32} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Can&apos;t reach the server</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      );
    }

    if (hasActiveFilters) {
      return (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="account-search-outline" size={32} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No matches</Text>
          <Text style={styles.emptyText}>Try a different name, number, or section.</Text>
        </View>
      );
    }

    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons name="account-multiple-outline" size={32} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>No contacts yet</Text>
        <Text style={styles.emptyText}>Add your first contact to get started.</Text>
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
              : `${filtered.length} ${filtered.length === 1 ? "contact" : "contacts"}`}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={toggleMode}
            accessibilityRole="button"
            accessibilityLabel={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            hitSlop={6}
            style={({ pressed }) => [styles.themeBtn, pressed && styles.themeBtnPressed]}
          >
            <MaterialCommunityIcons
              name={mode === "dark" ? "weather-sunny" : "weather-night"}
              size={20}
              color={colors.text}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push("/addPhone")}
            accessibilityRole="button"
            accessibilityLabel="Add phone"
            style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.onPrimary} />
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>
      </View>

      {!loading && data.length > 0 && (
        <View style={styles.filters}>
          <SearchField value={query} onChangeText={setQuery} placeholder="Search name or number" />
          <SectionFilter value={sectionFilter} onChange={setSectionFilter} />
        </View>
      )}

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Card phone={item} refresh={getData} />}
          contentContainerStyle={[
            styles.listContent,
            filtered.length === 0 && styles.listContentEmpty,
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

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  themeBtn: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeBtnPressed: {
    backgroundColor: colors.surfacePressed,
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
  filters: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
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
}
