import type { Metadata } from "next";
import SignUpClient from "./signUpClient";

export const metadata: Metadata = {
  title: "Sign Up | Souvenir Hub",
  description:
    "Create your Souvenir Hub account to start managing your agricultural operations",
};

export default function SignUpPage() {
  return <SignUpClient />;
}
