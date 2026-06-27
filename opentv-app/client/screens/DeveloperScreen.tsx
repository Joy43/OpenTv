import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Linking,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { TVFocusablePressable } from "@/components/TVFocusablePressable";

export default function DeveloperScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useResponsive();
  const { theme } = useTheme();

  const isWide = width > 768;

  // Social Links
  const handleOpenLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error("Failed to open link in WebBrowser, falling back to Linking:", error);
      Linking.openURL(url);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Native App-Like Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="tv" size={24} color={theme.primary} />
          <ThemedText type="h4" style={[styles.headerTitle, { color: theme.text }]}>
            OpenTv Developer
          </ThemedText>
        </View>
        {/* <Ionicons name="menu-outline" size={24} color={theme.text} /> */}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + Spacing["3xl"],
            paddingLeft: insets.left + Spacing.md,
            paddingRight: insets.right + Spacing.md,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainLayout, isWide && styles.mainLayoutWide]}>
          {/* Left Column / Hero Section */}
          <View style={[styles.heroSection, isWide && styles.columnHalf]}>
            <ThemedText type="h1" style={styles.heroTitle}>
              Building the Future of IPTV
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.heroBio, { color: theme.textSecondary }]}
            >
             Hello everyone, I am Shahsultan Islam Joy, a Full Stack Software Engineer focused on building scalable and high-performance applications. I work at the intersection of React Native (JSI), Native Android (Kotlin), and modern system architecture to deliver smooth, cinematic user experiences across all devices.
            </ThemedText>

            {/* Profile Grayscale Image */}
            <View style={[styles.imageContainer, { borderColor: theme.backgroundSecondary }]}>
              <Image
                source={{ uri: "https://www.ssjoy.me/assets/ssjoy-DrrQThnw.jpg" }}
                style={styles.profileImage}
                contentFit="cover"
              />
            </View>
          </View>

          {/* Right Column / Content Details */}
          <View style={[styles.detailsSection, isWide && styles.columnHalf]}>
            {/* Core Expertise Title */}
            <ThemedText type="h3" style={styles.sectionTitle}>
              Core Expertise
            </ThemedText>

            {/* Core Expertise Cards */}
            <View style={styles.cardsContainer}>
              {/* Card 1 */}
              <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconBox, { backgroundColor: theme.primary + "15" }]}>
                    <Ionicons name="code-slash" size={20} color={theme.primary} />
                  </View>
                  <ThemedText type="h4" style={styles.cardTitle}>
                    React Native
                  </ThemedText>
                </View>
                <ThemedText
                  type="small"
                  style={[styles.cardDescription, { color: theme.textSecondary }]}
                >
                  Custom JSI modules and TurboModules bridging high-performance
                  C++ and JavaScript for sub-10ms UI/thread responsiveness.
                </ThemedText>
                <View style={styles.pillsContainer}>
                  <View style={[styles.pill, { backgroundColor: theme.backgroundSecondary }]}>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>JSI</ThemedText>
                  </View>
                  <View style={[styles.pill, { backgroundColor: theme.backgroundSecondary }]}>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>TurboModules</ThemedText>
                  </View>
                </View>
              </View>

              {/* Card 2 */}
              <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconBox, { backgroundColor: theme.primary + "15" }]}>
                    <Ionicons name="logo-android" size={20} color={theme.primary} />
                  </View>
                  <ThemedText type="h4" style={styles.cardTitle}>
                    Android Native
                  </ThemedText>
                </View>
                <ThemedText
                  type="small"
                  style={[styles.cardDescription, { color: theme.textSecondary }]}
                >
                  Deep integration with ExoPlayer and Media3. Custom DRM
                  implementations and hardware-accelerated decoding pipelines.
                </ThemedText>
                <View style={styles.pillsContainer}>
                  <View style={[styles.pill, { backgroundColor: theme.backgroundSecondary }]}>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>Kotlin</ThemedText>
                  </View>
                  <View style={[styles.pill, { backgroundColor: theme.backgroundSecondary }]}>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>ExoPlayer</ThemedText>
                  </View>
                </View>
              </View>

              {/* Card 3 */}
              <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconBox, { backgroundColor: theme.primary + "15" }]}>
                    <Ionicons name="git-network-outline" size={20} color={theme.primary} />
                  </View>
                  <ThemedText type="h4" style={styles.cardTitle}>
                    System Design
                  </ThemedText>
                </View>
                <ThemedText
                  type="small"
                  style={[styles.cardDescription, { color: theme.textSecondary }]}
                >
                  Distributed systems for playlist processing and EPG
                  synchronization. Scalable architecture for millions of
                  concurrent users.
                </ThemedText>
                <View style={styles.pillsContainer}>
                  <View style={[styles.pill, { backgroundColor: theme.backgroundSecondary }]}>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>Architecture</ThemedText>
                  </View>
                  <View style={[styles.pill, { backgroundColor: theme.backgroundSecondary }]}>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>GraphQL</ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* Data Flow Architecture Section */}
            <ThemedText type="h3" style={[styles.sectionTitle, styles.sectionTitleSpacing]}>
              Data Flow Architecture
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
            >
              A simplified view of how OpenTv handles state and native bridging
            </ThemedText>

            {/* Architecture Steps Stack */}
            <View style={styles.stepsStack}>
              {/* Step 1 */}
              <View style={[styles.stepCard, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepInfo}>
                    <ThemedText type="body" style={styles.stepName}>
                      UI Layer
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                      React Native / TS
                    </ThemedText>
                  </View>
                  <Ionicons name="grid-outline" size={18} color={theme.primary} />
                </View>
              </View>

              {/* Step 2 */}
              <View style={[styles.stepCard, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepInfo}>
                    <ThemedText type="body" style={styles.stepName}>
                      PlaylistContext
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                      Zustand / Memory Cache
                    </ThemedText>
                  </View>
                  <Ionicons name="server-outline" size={18} color={theme.primary} />
                </View>
              </View>

              {/* Step 3 */}
              <View style={[styles.stepCard, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepInfo}>
                    <ThemedText type="body" style={styles.stepName}>
                      Native Modules
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                      JS / C++ / Kotlin
                    </ThemedText>
                  </View>
                  <Ionicons name="pulse-outline" size={18} color={theme.primary} />
                </View>
              </View>

              {/* Step 4 */}
              <View style={[styles.stepCard, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepInfo}>
                    <ThemedText type="body" style={styles.stepName}>
                      Media Pipeline
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                      ExoPlayer / GPU
                    </ThemedText>
                  </View>
                  <Ionicons name="tv-outline" size={18} color={theme.primary} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <View style={styles.footerBranding}>
            <Ionicons name="tv" size={20} color={theme.primary} />
            <ThemedText type="h4" style={[styles.footerTitle, { color: theme.primary }]}>
              OpenTv Architect
            </ThemedText>
          </View>
          <ThemedText
            type="caption"
            style={[styles.footerCopyright, { color: theme.textSecondary }]}
          >
            © 2026 OpenTv Architect. High-performance IPTV Engineering.
          </ThemedText>

          {/* Social Links Row */}
          <View style={styles.linksRow}>
            <TVFocusablePressable
              onPress={() => handleOpenLink("https://github.com/Joy43")}
              baseStyle={styles.linkButton}
              focusedStyle={StyleSheet.flatten([styles.linkButtonFocused, { backgroundColor: theme.primary + "15" }])}
              accessibilityRole="link"
            >
              <Ionicons name="logo-github" size={18} color={theme.text} />
              <ThemedText type="small" style={[styles.linkLabel, { color: theme.text }]}>
                GitHub
              </ThemedText>
            </TVFocusablePressable>

            <TVFocusablePressable
              onPress={() => handleOpenLink("https://www.ssjoy.me")}
              baseStyle={styles.linkButton}
              focusedStyle={StyleSheet.flatten([styles.linkButtonFocused, { backgroundColor: theme.primary + "15" }])}
              accessibilityRole="link"
            >
              <Ionicons name="document-text-outline" size={18} color={theme.text} />
              <ThemedText type="small" style={[styles.linkLabel, { color: theme.text }]}>
                Docs
              </ThemedText>
            </TVFocusablePressable>

            <TVFocusablePressable
              onPress={() => handleOpenLink("https://stackoverflow.com")}
              baseStyle={styles.linkButton}
              focusedStyle={StyleSheet.flatten([styles.linkButtonFocused, { backgroundColor: theme.primary + "15" }])}
              accessibilityRole="link"
            >
              <Ionicons name="code-slash-outline" size={18} color={theme.text} />
              <ThemedText type="small" style={[styles.linkLabel, { color: theme.text }]}>
                Stack
              </ThemedText>
            </TVFocusablePressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerTitle: {
    fontWeight: "700",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Spacing.md,
  },
  mainLayout: {
    flexDirection: "column",
    gap: Spacing.xl,
  },
  mainLayoutWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  columnHalf: {
    flex: 1,
  },
  heroSection: {
    alignItems: "flex-start",
  },
  heroTitle: {
    marginBottom: Spacing.sm,
    fontWeight: "800",
  },
  heroBio: {
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1.1,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: Spacing.md,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    // Apply grayscale simulation using screen overlay styling or normal styling since react-native doesn't have CSS filter
  },
  detailsSection: {
    flexDirection: "column",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: "700",
  },
  sectionTitleSpacing: {
    marginTop: Spacing.xl,
  },
  sectionSubtitle: {
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  cardsContainer: {
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "700",
  },
  cardDescription: {
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  pill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  stepsStack: {
    gap: Spacing.sm,
  },
  stepCard: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepInfo: {
    flexDirection: "column",
  },
  stepName: {
    fontWeight: "600",
  },
  footer: {
    marginTop: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  footerBranding: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  footerTitle: {
    fontWeight: "700",
  },
  footerCopyright: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  linksRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  linkButtonFocused: {
    transform: [{ scale: 1.05 }],
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  linkLabel: {
    fontWeight: "600",
  },
});
