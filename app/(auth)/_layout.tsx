import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Màn hình Đăng nhập (login.tsx) */}
      <Stack.Screen name="login" />
      
      {/* Màn hình Đăng ký (register.tsx) */}
      <Stack.Screen name="register" />
    </Stack>
  );
}
