import { Suspense } from "react";
import { AuthPage } from "@/features/auth/AuthPage";

export function Login() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}

export default Login;