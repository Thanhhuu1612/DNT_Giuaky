import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../src/firebaseConfig";


interface UserData {
    username: string;
    email: string;
    password: string;
    image?: string | null; 
}

export default function EditUser() {
 const params = useLocalSearchParams(); 
 const id = params.id; // Lấy tham số id
 const router = useRouter();
 
 const [user, setUser] = useState<UserData | null>(null);
 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 
 const [loading, setLoading] = useState(true);
 const [isUpdating, setIsUpdating] = useState(false);
 const [showPassword, setShowPassword] = useState(false); 

 useEffect(() => {
    // Xử lý id nếu nó là array (tránh lỗi khi dùng useLocalSearchParams)
  const userId = Array.isArray(id) ? id[0] : id;
  if (!userId) {
        setLoading(false);
        return;
    }

    const fetchUser = async () => {
        try {
            const docRef = doc(db, "users", userId as string);
            const d = await getDoc(docRef);

            if (d.exists()) {
                const data = d.data() as UserData;
                setUser(data);
                // Gán giá trị data vào state
                setUsername(data.username || "");
                setEmail(data.email || "");
                setPassword(data.password || "");
            } else {
                Alert.alert("Lỗi", "Không tìm thấy người dùng này.");
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
            Alert.alert("Lỗi tải dữ liệu", "Không thể kết nối hoặc tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    };
    fetchUser();
   }, [id]);
 const handleSave = async () => {
    const userId = Array.isArray(id) ? id[0] : id;
    if (!userId) return;

    setIsUpdating(true);
    
    try {
      // Bắt buộc phải có 4 trường: username, email, password, image (image=null)
      await updateDoc(doc(db, "users", userId as string), {
        username,
        email,
        password,
        image: null, // Đảm bảo trường image là null hoặc giữ nguyên item.image cũ nếu bạn muốn
      });
      console.log(`✅ User data updated for ID: ${userId}`);

      Alert.alert("Thành công", "Cập nhật người dùng thành công!");
   router.push("/(admin)/users");
      
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
      // Lỗi update thường do Firebase Rules (Permission Denied)
      Alert.alert("Lỗi", "Không thể lưu thông tin. Vui lòng kiểm tra Firebase Rules và thử lại.");
    } finally {
      setIsUpdating(false);
    }
 };

 if (loading) {
     return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
     );
  }
 if (!user) return <View style={styles.center}><Text style={styles.errorText}>Không có dữ liệu người dùng.</Text></View>;

 return (
  <View style={styles.container}>
   <Text style={styles.header}>Chỉnh sửa người dùng</Text>
   
      <Text style={styles.label}>Tên người dùng:</Text>
   <TextInput 
        value={username} 
        onChangeText={setUsername} 
        style={styles.input} 
        placeholder="Nhập tên người dùng"
      />

      <Text style={styles.label}>Email:</Text>
   <TextInput 
       value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        placeholder="Nhập email"
        keyboardType="email-address"
      />
      
      <Text style={styles.label}>Mật khẩu:</Text>
      {/* Container cho Password để đặt icon */}
      <View style={styles.passwordContainer}>
        <TextInput 
            value={password} 
            onChangeText={setPassword} 
            // Dùng state để điều khiển thuộc tính secureTextEntry
            secureTextEntry={!showPassword} 
            style={styles.passwordInput} 
            placeholder="Nhập mật khẩu"
        />
        <Pressable 
            onPress={() => setShowPassword(!showPassword)} 
            style={styles.icon}
        >
            <Feather 
                name={showPassword ? "eye" : "eye-off"} 
                size={20} 
                color="gray" 
            />
        </Pressable>
      </View>
 
   <Button 
          title={isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"} 
          onPress={handleSave} 
          disabled={isUpdating} 
          color="#4CAF50"
     />
  </View>
 );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc',
    padding: 10, 
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    paddingRight: 40,
  },
  icon: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
});