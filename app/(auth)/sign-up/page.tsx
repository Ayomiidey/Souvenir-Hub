import type { Metadata } from "next";
import SignUpClient from "./signUpClient";

export const metadata: Metadata = {
  title: "Sign Up | FAM 8",
  description:
    "Create your FAM 8 account to start managing your agricultural operations",
};

export default function SignUpPage() {
  return <SignUpClient />;
}
