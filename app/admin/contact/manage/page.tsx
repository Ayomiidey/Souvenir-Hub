"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Settings
} from "lucide-react";
import { toast } from "sonner";

type ContactInfo = {
  phone: string;
  email: string;
  address: string;
  businessHours: {
    weekdays: string;
    weekends: string;
  };
};

export default function ContactManagePage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "+1 (555) 123-4567",
    email: "info@souvenirshop.com",
    address: "123 Main St, City, State 12345",
    businessHours: {
      weekdays: "Mon - Fri: 9AM - 6PM",
      weekends: "Sat - Sun: 10AM - 4PM"
    }
  });

  // Fetch contact info on component mount
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
      toast.error('Failed to load contact information');
    }
  };

  const handleSaveContactInfo = () => {
    toast.promise(
      fetch('/api/contact-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update contact information');
        }
        return response.json();
      }),
      {
        loading: "Saving contact information...",
        success: "Contact information updated successfully!",
        error: (err) => err.message || "Failed to update contact information",
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Contact Content</h1>
        <p className="text-muted-foreground">
          Update contact information displayed on your contact page
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Contact Information</span>
          </CardTitle>
          <CardDescription>
            Update the contact details displayed on your contact page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </Label>
              <Input
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Business Address</span>
            </Label>
            <Input
              id="address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              placeholder="Enter complete business address"
            />
          </div>

          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Business Hours</span>
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weekdays" className="text-sm font-medium">
                  Weekdays (Monday - Friday)
                </Label>
                <Input
                  id="weekdays"
                  value={contactInfo.businessHours.weekdays}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    businessHours: {
                      ...contactInfo.businessHours,
                      weekdays: e.target.value
                    }
                  })}
                  placeholder="e.g., Mon - Fri: 9AM - 6PM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekends" className="text-sm font-medium">
                  Weekends (Saturday - Sunday)
                </Label>
                <Input
                  id="weekends"
                  value={contactInfo.businessHours.weekends}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    businessHours: {
                      ...contactInfo.businessHours,
                      weekends: e.target.value
                    }
                  })}
                  placeholder="e.g., Sat - Sun: 10AM - 4PM"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSaveContactInfo} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Contact Information
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}