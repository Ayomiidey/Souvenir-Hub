"use client";

import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignInForm } from "@/components/auth/signInForm";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function SignInClient() {
  const {
    signInWithCredentials,
    signInWithGoogle,
    isLoading,
    isGoogleLoading,
    error,
  } = useAuth();

  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Don't have an account?"
      linkText="Sign up"
      linkHref="/sign-up"
      linkLabel="Create a new account"
    >
      {message && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}

      <SignInForm
        onSubmit={signInWithCredentials}
        onGoogleSignIn={signInWithGoogle}
        isLoading={isLoading}
        isGoogleLoading={isGoogleLoading}
        error={error}
      />
    </AuthLayout>
  );
}
