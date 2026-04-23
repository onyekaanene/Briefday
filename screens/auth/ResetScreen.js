import React, { useState } from "react";
import CreditTag from "../../components/CreditTag";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export default function ResetScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (error) {
      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/user-not-found")
        message = "No account found with this email.";
      if (error.code === "auth/invalid-email")
        message = "Please enter a valid email address.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {sent ? (
          // Success State
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>📬</Text>
            <Text style={styles.title}>Check your inbox!</Text>
            <Text style={styles.subtitle}>
              We sent a password reset link to{" "}
              <Text style={{ fontWeight: "700", color: COLORS.primary }}>
                {email}
              </Text>
            </Text>
            <PrimaryButton
              label="Back to Login"
              onPress={() => navigation.navigate("Login")}
              color={COLORS.primary}
            />
          </View>
        ) : (
          // Form State
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Reset Password 🔑</Text>
              <Text style={styles.subtitle}>
                Enter the email address linked to your account and we'll send
                you a reset link.
              </Text>
            </View>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <PrimaryButton
              label="Send Reset Link"
              onPress={handleReset}
              loading={loading}
              color={COLORS.primary}
            />
          </>
        )}
      </View>
      <CreditTag />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  backText: {
    fontSize: FONTS.body,
    color: COLORS.primary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.heading,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  label: {
    fontSize: FONTS.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.body,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  successContainer: {
    alignItems: "center",
    paddingTop: SPACING.xl,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
});
