import { SafeAreaView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { w, h } from "./src/utils";

export default function SignInScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Hello!</Text>
        <Text style={styles.subtitle}>Sign in to use your transcription</Text>
        <KeyboardAvoidingView behavior="position" style={styles.inputsContainer} KeyboardAvoidingView>
            <TextInput
            style={styles.input}
            placeholderTextColor="#fff"
            placeholder="Username"
            textAlign="center"
            />
            <TextInput
            style={{ ...styles.input, marginTop: 17 }}
            placeholderTextColor="#fff"
            placeholder="Password"
            textAlign="center"
            secureTextEntry
            />
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </KeyboardAvoidingView>
        <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Sign in</Text>
            <View style={styles.iconButtonContainer}> 
            <Icon name="arrow-right" size={18} color="#fff" />
            </View>
        </TouchableOpacity>
        <Text style={styles.registerButtonText}>No account yet? Create</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  title: {
    color: "#000",
    fontSize: 54,
    marginTop: h * 0.12,
    fontWeight: "bold"
  },
  subtitle: {
    width: 200,
    textAlign: "center",
    marginTop: 27,
    fontSize: 20
  },
  inputsContainer: {
    marginTop: 100,
    paddingBottom: 30
  },  
  input: {
    width: 345,
    height: 66,
    backgroundColor: "#7377FF",
    borderRadius: 21,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff"
  },
  forgotPasswordText: {
    color: "#7377FF",
    fontSize: 17,
    marginTop: 12,
    alignSelf: "flex-end",
    marginRight: 10
  },
  loginButton: {
    marginTop: 105,
    display: "flex",
    flexDirection: "row"
  },
  loginButtonText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold"
  },
  iconButtonContainer: {
    backgroundColor: "#7377FF",
    width: 42,
    height: 29,
    borderRadius: 14.5,
    marginLeft: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  registerButtonText: {
    fontSize: 18,
    color: "#7377FF",
    marginTop: 15
  },
});