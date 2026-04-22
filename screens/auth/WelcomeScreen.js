import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Top Section - Logo & Branding */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>📅</Text>
        </View>
        <Text style={styles.appName}>Briefday</Text>
        <Text style={styles.tagline}>Your day. Organized. Intelligent.</Text>
      </View>

      {/* Middle Section - Feature Highlights */}
      <View style={styles.featuresSection}>
        <FeatureRow icon="✅" text="Manage tasks with AI-powered suggestions" />
        <FeatureRow icon="📅" text="Schedule and track your meetings" />
        <FeatureRow icon="👥" text="Collaborate with your team" />
        <FeatureRow icon="📍" text="Map-In your location for check-ins" />
      </View>

      {/* Bottom Section - Buttons */}
      <View style={styles.bottomSection}>
        <PrimaryButton
          label="Get Started"
          onPress={() => navigation.navigate("Signup")}
          color={COLORS.accent}
        />
        <PrimaryButton
          label="I already have an account"
          onPress={() => navigation.navigate("Login")}
          variant="outline"
          color={COLORS.primary}
        />
      </View>
    </SafeAreaView>
  );
}

// Small reusable row for feature highlights
function FeatureRow({ icon, text }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
  },
  topSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: FONTS.heading,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FONTS.body,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  featuresSection: {
    flex: 2,
    justifyContent: "center",
    paddingHorizontal: SPACING.sm,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12,
    marginVertical: SPACING.xs,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: SPACING.md,
  },
  featureText: {
    fontSize: FONTS.body,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: SPACING.lg,
  },
});
