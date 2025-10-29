import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, FlatList, Image, StyleSheet, RefreshControl, Alert } from "react-native";
import { db } from "../../src/firebaseConfig.tsx";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Users() {
 const [users, setUsers] = useState<any[]>([]);
 const [refreshing, setRefreshing] = useState(false);
 const router = useRouter();

 const fetchUsers = useCallback(async () => {
  setRefreshing(true);    try {
   const snapshot = await getDocs(collection(db, "users"));
   // Ánh xạ dữ liệu và thêm ID của document
   const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })); 
   setUsers(list);
   console.log(`LOG: Fetched ${list.length} users successfully.`);
 } catch (error) {
   console.error("Lỗi khi tải danh sách người dùng:", error);
   Alert.alert("Lỗi", "Không thể tải danh sách người dùng.");
  } finally {
   setRefreshing(false);
  }
 }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

 const handleDelete = (id: string) => {
    // Thêm xác nhận trước khi xóa
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa người dùng này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "users", id));
              console.log(`LOG: Deleted user with ID: ${id}`);
              Alert.alert("Thành công", "Người dùng đã bị xóa.");
              fetchUsers(); // Tải lại danh sách sau khi xóa
            } catch (error) {
              console.error("Lỗi khi xóa người dùng:", error);
              Alert.alert("Lỗi xóa", "Không thể xóa người dùng. Kiểm tra Firebase Rules.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Thêm người dùng" onPress={() => router.push("/(auth)/register")} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
        }
        ListEmptyComponent={<Text style={styles.emptyList}>Không có người dùng nào được tìm thấy.</Text>}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            
            <Text>
                <Text style={{ fontWeight: 'bold' }}>👤 Tên:</Text> {item.username}
            </Text>
            <Text>
                <Text style={{ fontWeight: 'bold' }}>📧 Email:</Text> {item.email}
            </Text>
            <Text>
                <Text style={{ fontWeight: 'bold' }}>🔑 Mật khẩu:</Text> {item.password}
            </Text>
            
            {/* Hiển thị ảnh (nếu có) hoặc thông báo */}
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
                <Text style={{ color: '#999', marginTop: 5 }}>Không có ảnh đại diện</Text>
            )}

            <View style={styles.buttonContainer}>
                <Button 
                    title="Sửa" 
                    // Định tuyến đến màn hình chỉnh sửa với ID
                    onPress={() => router.push(`/(admin)/${item.id}`)} 
                />
                <Button 
                    title="Xóa" 
                    color="red" 
                    onPress={() => handleDelete(item.id)} 
                />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  userItem: { 
    borderWidth: 1, 
    borderColor: '#ddd',
    padding: 15, 
    marginVertical: 8, 
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  image: { 
    width: 80, 
    height: 80, 
    borderRadius: 40,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  }
});