"use client";

import type React from "react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  success?: boolean;
  helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      touched,
      showPasswordToggle,
      showPassword,
      onTogglePassword,
      success,
      helperText,
      className,
      ...props
    },
    ref
  ) => {
    const hasError = touched && error;
    const hasSuccess =
      touched &&
      !error &&
      success &&
      props.value &&
      String(props.value).length > 0;

    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "transition-all duration-200 pr-10",
              hasError &&
                "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50",
              hasSuccess &&
                "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50",
              !hasError &&
                !hasSuccess &&
                "focus:border-emerald-500 focus:ring-emerald-500",
              className
            )}
            {...props}
          />

          {/* Password toggle or status icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={onTogglePassword}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </Button>
            )}

            {!showPasswordToggle && hasError && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}

            {!showPasswordToggle && hasSuccess && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>

        {/* Error message */}
        {hasError && (
          <p className="text-sm text-red-600 flex items-start gap-1">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}

        {/* Success message */}
        {hasSuccess && !helperText && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Looks good!</span>
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
