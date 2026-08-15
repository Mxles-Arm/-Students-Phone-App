import Constants from "expo-constants";
import axios from "axios";
import { Platform } from "react-native";

const API_PORT = 3008;

/**
 * "localhost" only resolves to the API on web/iOS simulator — a physical
 * device or Android emulator means something else by it. Metro's own
 * hostUri (the address the phone used to load this bundle) always points
 * at the dev machine, so reuse that host for the API instead of guessing.
 */
function resolveBaseURL(): string {
  // On web, expo-constants doesn't populate hostUri — the browser's own
  // address bar already has the right host, so just read it directly.
  // Guard on `window` (not just Platform.OS) because Expo Router's web
  // build runs this module during server-side static rendering too,
  // where there is no window yet.
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `http://${window.location.hostname}:${API_PORT}`;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(":")[0];

  if (host) {
    return `http://${host}:${API_PORT}`;
  }

  // Android emulator's loopback to the host machine; falls back here only
  // when hostUri isn't available (e.g. production build with no dev server).
  return `http://10.0.2.2:${API_PORT}`;
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;