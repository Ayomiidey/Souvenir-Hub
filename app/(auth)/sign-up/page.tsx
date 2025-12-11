import type { Metadata } from "next";
import SignUpClient from "./signUpClient";

export const metadata: Metadata = {
  title: "Sign Up | Classy Souvenir",
  description:
    "Create your Classy Souvenir account to start managing your agricultural operations",
};

export default function SignUpPage() {
  return <SignUpClient />;
}
