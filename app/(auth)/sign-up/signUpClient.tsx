"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpForm } from "@/components/auth/signUpForm";
import { useAuth } from "@/hooks/use-auth";

export default function SignUpClient() {
  const { signUp, isLoading, error } = useAuth();

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account?"
      linkText="Sign in"
      linkHref="/sign-in"
      linkLabel="Sign in to your existing account"
    >
      <SignUpForm onSubmit={signUp} isLoading={isLoading} error={error} />
    </AuthLayout>
  );
}
