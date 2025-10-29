import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet, Pressable } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/firebaseConfig";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; 

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  
  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log(`✅ Đăng nhập thành công! User UID: ${userCred.user.uid}`);
      Alert.alert("Thành công", "Đăng nhập thành công!");
      router.push("/(admin)/users");
    } catch (error: any) {
      console.error("❌ Lỗi đăng nhập:", error.message);
      Alert.alert("Lỗi đăng nhập", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chào mừng trở lại</Text>
      
      <TextInput 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          style={styles.input} 
          keyboardType="email-address"
          placeholderTextColor="#999"
      />
      
      {/* Container cho Password để đặt icon */}
      <View style={styles.passwordContainer}>
        <TextInput 
            placeholder="Mật khẩu" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={!showPassword} 
            style={styles.passwordInput} 
          placeholderTextColor="#999"
        />
        <Pressable 
            onPress={() => setShowPassword(!showPassword)} 
            style={styles.icon}
        >
            <Feather 
                name={showPassword ? "eye" : "eye-off"} 
                size={20} 
                color="#666" 
            />
        </Pressable>
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="ĐĂNG NHẬP" onPress={handleLogin} color="#4CAF50" />
      </View>
      
      <Text style={styles.link} onPress={() => router.push("/(auth)/register")}>
        Chưa có tài khoản? **Đăng ký ngay**
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#F7F9FC', 
        justifyContent: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginVertical: 8,
        padding: 14,
        borderRadius: 8,
        fontSize: 16,
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        position: 'relative',
    },
    passwordInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 14,
        borderRadius: 8,
        fontSize: 16,
        paddingRight: 50,
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    icon: {
        position: 'absolute',
        right: 15,
        padding: 5,
    },
    buttonWrapper: {
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    link: {
        marginTop: 10,
        color: '#555',
        textAlign: 'center',
        fontWeight: '400',
    }
});