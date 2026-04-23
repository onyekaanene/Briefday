import React, { useState } from "react";
import CreditTag from "../../components/CreditTag";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Navigation happens automatically via AppNavigator
      // Firebase auth state change triggers it
    } catch (error) {
      // Make Firebase error messages human-friendly
      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/user-not-found")
        message = "No account found with this email.";
      if (error.code === "auth/wrong-password")
        message = "Incorrect password. Please try again.";
      if (error.code === "auth/invalid-email")
        message = "Please enter a valid email address.";
      if (error.code === "auth/too-many-requests")
        message = "Too many attempts. Please try again later.";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back 👋</Text>
            <Text style={styles.subtitle}>Log in to your Briefday account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Your password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Reset")}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonSection}>
            <PrimaryButton
              label="Log In"
              onPress={handleLogin}
              loading={loading}
              color={COLORS.primary}
            />
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          <CreditTag />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
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
    marginTop: SPACING.xs,
  },
  form: {
    marginBottom: SPACING.lg,
    gap: 4,
  },
  label: {
    fontSize: FONTS.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.body,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordInput: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONTS.body,
    color: COLORS.text,
  },
  eyeButton: {
    padding: SPACING.md,
  },
  eyeText: {
    fontSize: 18,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: SPACING.sm,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: FONTS.small,
    fontWeight: "600",
  },
  buttonSection: {
    marginTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  signupText: {
    color: COLORS.textLight,
    fontSize: FONTS.body,
  },
  signupLink: {
    color: COLORS.accent,
    fontSize: FONTS.body,
    fontWeight: "700",
  },
});
