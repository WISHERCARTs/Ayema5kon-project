// # root component เรียก MainLayout / AdminLayout

// src/App.jsx
import AppRouter from "./router";
import { AuthProvider } from "./lib/auth";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
