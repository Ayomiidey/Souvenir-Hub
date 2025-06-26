"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn } from "lucide-react";
import { FormField } from "../ui/form-field";
import { useFormValidation } from "@/hooks/use-form-validation";
import { signinSchema, type SignInData } from "@/lib/validations/auth";

interface SignInFormProps {
  onSubmit: (data: SignInData) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  isLoading?: boolean;
  isGoogleLoading?: boolean;
  error?: string;
}

export function SignInForm({
  onSubmit,
  onGoogleSignIn,
  isLoading = false,
  isGoogleLoading = false,
  error,
}: SignInFormProps) {
  const [formData, setFormData] = useState<SignInData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldTouched,
    clearErrors,
  } = useFormValidation(signinSchema);

  const handleInputChange = (field: keyof SignInData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (touched[field]) {
      validateField(field, value, newFormData);
    }
  };

  const handleBlur = (field: keyof SignInData) => {
    setFieldTouched(field);
    validateField(field, formData[field], formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    Object.keys(formData).forEach((field) => setFieldTouched(field));

    if (validateForm(formData)) {
      try {
        await onSubmit(formData);
        clearErrors();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.email.length > 0 &&
    formData.password.length > 0;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e: { target: { value: string } }) =>
            handleInputChange("email", e.target.value)
          }
          onBlur={() => handleBlur("email")}
          error={errors.email}
          touched={touched.email}
          success={touched.email && !errors.email && formData.email.length > 0}
          disabled={isLoading || isGoogleLoading}
          placeholder="Enter your email address"
          autoComplete="email"
          required
        />

        <FormField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          touched={touched.password}
          disabled={isLoading || isGoogleLoading}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormValid || isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>
    </div>
  );
}
