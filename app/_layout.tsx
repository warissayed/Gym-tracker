import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This will automatically handle the routes based on the file structure */}
    </Stack>
  );
}
