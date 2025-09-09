import { Suspense } from "react";
import type { Metadata } from "next";
import SignInClient from "./signInClient";

export const metadata: Metadata = {
  title: "Sign In | Souvenir Hub",
  description:
    "Sign in to your Souvenir Hub account to manage your agricultural operations",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      }
    >
      <SignInClient />
    </Suspense>
  );
}
