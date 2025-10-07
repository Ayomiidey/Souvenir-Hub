"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Plus,
  Trash2,
  Settings,
  Edit,
  X,
  Check,
  MessageCircle
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

type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

type FAQCategory = {
  id: string;
  name: string;
  description?: string;
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

  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: "1",
      category: "Orders & Shipping",
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the continental US."
    },
    {
      id: "2",
      category: "Orders & Shipping",
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email."
    }
  ]);

  const [categories, setCategories] = useState<FAQCategory[]>([
    { id: "1", name: "Orders & Shipping", description: "Questions about ordering and delivery" },
    { id: "2", name: "Products & Customization", description: "Product-related inquiries" },
    { id: "3", name: "Returns & Exchanges", description: "Return and exchange policies" },
    { id: "4", name: "Account & Payment", description: "Account and payment information" }
  ]);

  const [newFaq, setNewFaq] = useState<Omit<FAQItem, "id">>({
    category: "",
    question: "",
    answer: ""
  });

  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<FAQCategory, "id">>({
    name: "",
    description: ""
  });
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);

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

  const handleAddFaq = () => {
    if (newFaq.category && newFaq.question && newFaq.answer) {
      const faq: FAQItem = {
        ...newFaq,
        id: Date.now().toString()
      };
      setFaqs([...faqs, faq]);
      setNewFaq({ category: "", question: "", answer: "" });
      toast.success("New FAQ item has been added successfully!");
    }
  };

  const handleEditFaq = (faq: FAQItem) => {
    setEditingFaq(faq);
  };

  const handleUpdateFaq = () => {
    if (editingFaq && editingFaq.category && editingFaq.question && editingFaq.answer) {
      setFaqs(faqs.map(faq => faq.id === editingFaq.id ? editingFaq : faq));
      setEditingFaq(null);
      toast.success("FAQ item updated successfully!");
    }
  };

  const handleCancelEdit = () => {
    setEditingFaq(null);
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      const category: FAQCategory = {
        ...newCategory,
        id: Date.now().toString()
      };
      setCategories([...categories, category]);
      setNewCategory({ name: "", description: "" });
      toast.success("New category added successfully!");
    }
  };

  const handleEditCategory = (category: FAQCategory) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name) {
      // Update category name in all FAQs
      const oldName = categories.find(c => c.id === editingCategory.id)?.name;
      if (oldName && oldName !== editingCategory.name) {
        setFaqs(faqs.map(faq => 
          faq.category === oldName 
            ? { ...faq, category: editingCategory.name }
            : faq
        ));
      }
      
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
      toast.success("Category updated successfully!");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(c => c.id === categoryId);
    if (!categoryToDelete) return;

    const faqsInCategory = faqs.filter(faq => faq.category === categoryToDelete.name);
    
    if (faqsInCategory.length > 0) {
      toast.error(`Cannot delete category "${categoryToDelete.name}" because it contains ${faqsInCategory.length} FAQ(s). Please move or delete the FAQs first.`);
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        if (!confirm(`Are you sure you want to delete the category "${categoryToDelete.name}"?`)) {
          reject(new Error("Cancelled"));
          return;
        }
        
        setTimeout(() => {
          setCategories(categories.filter(cat => cat.id !== categoryId));
          resolve("Category deleted");
        }, 500);
      }),
      {
        loading: "Deleting category...",
        success: "Category deleted successfully!",
        error: (err) => err.message === "Cancelled" ? "" : "Failed to delete category",
      }
    );
  };

  const handleDeleteFaq = (id: string) => {
    toast.promise(
      new Promise((resolve, reject) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) {
          reject(new Error("Cancelled"));
          return;
        }
        
        // Simulate API call and update state
        setTimeout(() => {
          setFaqs(faqs.filter(faq => faq.id !== id));
          resolve("FAQ deleted");
        }, 500);
      }),
      {
        loading: "Deleting FAQ...",
        success: "FAQ item has been removed successfully!",
        error: (err) => err.message === "Cancelled" ? "" : "Failed to delete FAQ",
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Contact Content</h1>
        <p className="text-muted-foreground">
          Update contact information and manage FAQ content
        </p>
      </div>

      <Tabs defaultValue="contact-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact-info">Contact Information</TabsTrigger>
          <TabsTrigger value="faq-management">FAQ Management</TabsTrigger>
        </TabsList>

        <TabsContent value="contact-info" className="space-y-6">
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
                  placeholder="Enter business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weekdays" className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Weekday Hours</span>
                  </Label>
                  <Input
                    id="weekdays"
                    value={contactInfo.businessHours.weekdays}
                    onChange={(e) => setContactInfo({ 
                      ...contactInfo, 
                      businessHours: { ...contactInfo.businessHours, weekdays: e.target.value }
                    })}
                    placeholder="e.g., Mon - Fri: 9AM - 6PM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekends" className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Weekend Hours</span>
                  </Label>
                  <Input
                    id="weekends"
                    value={contactInfo.businessHours.weekends}
                    onChange={(e) => setContactInfo({ 
                      ...contactInfo, 
                      businessHours: { ...contactInfo.businessHours, weekends: e.target.value }
                    })}
                    placeholder="e.g., Sat - Sun: 10AM - 4PM"
                  />
                </div>
              </div>

              <Button onClick={handleSaveContactInfo} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Contact Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="faq-management" className="space-y-6">
          {/* Category Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>FAQ Categories</span>
              </CardTitle>
              <CardDescription>
                Manage FAQ categories ({categories.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Category Form */}
              <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                <h4 className="font-medium">Add New Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="e.g., Orders & Shipping, Returns, Products"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description (Optional)</Label>
                    <Input
                      id="categoryDescription"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Brief description of this category"
                    />
                  </div>
                </div>
                <Button onClick={handleAddCategory} disabled={!newCategory.name} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {/* Existing Categories */}
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-3">
                    {editingCategory?.id === category.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category Name</Label>
                            <Input
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              placeholder="Category name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={editingCategory.description || ""}
                              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                              placeholder="Category description"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleUpdateCategory}>
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium">{category.name}</h4>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {faqs.filter(faq => faq.category === category.name).length} FAQ(s)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New FAQ</span>
              </CardTitle>
              <CardDescription>
                Create a new frequently asked question
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  placeholder="Enter the question"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  placeholder="Enter the answer"
                  rows={4}
                />
              </div>

              <Button onClick={handleAddFaq}>
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </CardContent>
          </Card>

          {/* Existing FAQs by Category */}
          {categories.map((category) => {
            const categoryFaqs = faqs.filter(faq => faq.category === category.name);
            
            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {categoryFaqs.length} question{categoryFaqs.length !== 1 ? 's' : ''}
                    {category.description && ` • ${category.description}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryFaqs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No FAQs in this category yet.</p>
                      <p className="text-sm">Add your first FAQ using the form above or the button above.</p>
                    </div>
                  ) : (
                    categoryFaqs.map((faq) => (
                      <div key={faq.id} className="border rounded-lg p-4 space-y-2">
                        {editingFaq?.id === faq.id ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <select
                                value={editingFaq.category}
                                onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Question</Label>
                              <Input
                                value={editingFaq.question}
                                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                                placeholder="Enter the question"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Answer</Label>
                              <Textarea
                                value={editingFaq.answer}
                                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                                placeholder="Enter the answer"
                                rows={4}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleUpdateFaq}>
                                <Check className="h-4 w-4 mr-2" />
                                Save Changes
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{faq.question}</h4>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditFaq(faq)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteFaq(faq.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}