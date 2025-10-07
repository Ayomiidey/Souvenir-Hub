"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Send,
  Settings
} from "lucide-react";

type ConfigStatus = {
  status: "success" | "error";
  message: string;
  config?: {
    fromEmail: string;
    adminEmail: string;
    apiKeyConfigured: boolean;
  };
  missingVariables?: string[];
};

export default function EmailTestPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const checkEmailConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email-test');
      const data = await response.json();
      setConfigStatus(data);
      
      if (data.status === "success") {
        toast.success("Email configuration is properly set up!");
      } else {
        toast.error("Email configuration issues found");
      }
    } catch {
      toast.error("Failed to check email configuration");
      setConfigStatus({
        status: "error",
        message: "Failed to check configuration"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail.trim()) {
      toast.error("Please enter a test email address");
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch('/api/email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        toast.success(`Test email sent successfully to ${testEmail}!`);
        setTestEmail("");
      } else {
        toast.error(data.message || "Failed to send test email");
      }
    } catch {
      toast.error("Failed to send test email");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Configuration</h1>
        <p className="text-muted-foreground">
          Test and configure your email system for contact forms and admin replies
        </p>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configuration Status</span>
          </CardTitle>
          <CardDescription>
            Check if your email environment variables are properly configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkEmailConfig} disabled={isLoading}>
            {isLoading ? "Checking..." : "Check Configuration"}
          </Button>

          {configStatus && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {configStatus.status === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={configStatus.status === "success" ? "text-green-600" : "text-red-600"}>
                  {configStatus.message}
                </span>
              </div>

              {configStatus.status === "success" && configStatus.config && (
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">From Email:</span>
                      <p className="text-sm text-gray-600">{configStatus.config.fromEmail}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Admin Email:</span>
                      <p className="text-sm text-gray-600">{configStatus.config.adminEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      API Key Configured
                    </Badge>
                  </div>
                </div>
              )}

              {configStatus.status === "error" && configStatus.missingVariables && (
                <div className="bg-red-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Missing Environment Variables:</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {configStatus.missingVariables.map((variable) => (
                      <li key={variable}>{variable}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-red-600 mt-2">
                    Please check MAIL_SETUP.md in your project root for setup instructions.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Send Test Email</span>
          </CardTitle>
          <CardDescription>
            Send a test email to verify that your email system is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your-email@example.com"
            />
          </div>

          <Button onClick={sendTestEmail} disabled={isTesting || !testEmail.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {isTesting ? "Sending..." : "Send Test Email"}
          </Button>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">What this test covers:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>✓ API key authentication</li>
              <li>✓ Email delivery capability</li>
              <li>✓ HTML email rendering</li>
              <li>✓ From address configuration</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Email Features</CardTitle>
          <CardDescription>
            Overview of email functionality in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Contact Form Emails</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Customer confirmation emails</li>
                <li>• Admin notification emails</li>
                <li>• Professional HTML templates</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Admin Reply System</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Direct email replies from admin panel</li>
                <li>• Branded email templates</li>
                <li>• Automatic status updates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}