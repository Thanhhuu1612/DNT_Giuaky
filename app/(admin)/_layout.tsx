import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="users" options={{ title: 'Danh sách người dùng' }} />
      {/* Tên 'name' khớp với tên file động: [id].tsx */}
      <Stack.Screen name="[id]" options={{ title: 'Chỉnh sửa Người dùng' }} /> 
    </Stack>
  );
}
