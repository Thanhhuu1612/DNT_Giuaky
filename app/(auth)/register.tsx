import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet, Pressable } from "react-native";
import { auth, db } from "../../src/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; 

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

const handleRegister = async () => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      username,
      email,
      password,
      image: null,
    });
    
    Alert.alert("Thành công", "Đăng ký thành công!");
    router.push("/(auth)/login");
  } catch (error: any) {
    Alert.alert("Lỗi đăng ký", error.message);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo Tài Khoản Mới</Text>
      
      <TextInput
        placeholder="Tên người dùng"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#999"
      />
      
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
          <Button title="ĐĂNG KÝ" onPress={handleRegister} color="#1E88E5" />
      </View>


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