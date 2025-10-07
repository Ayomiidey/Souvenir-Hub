"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

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

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [newFaq, setNewFaq] = useState<{
    categoryId: string;
    categoryName: string;
    question: string;
    answer: string;
  }>({
    categoryId: "",
    categoryName: "",
    question: "",
    answer: ""
  });

  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<FAQCategory, "id">>({
    name: "",
    description: ""
  });
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadFAQData();
  }, []);

  const loadFAQData = async () => {
    try {
      setLoading(true);
      const [faqResponse, categoriesResponse] = await Promise.all([
        fetch('/api/faq'),
        fetch('/api/faq/categories')
      ]);

      if (faqResponse.ok && categoriesResponse.ok) {
        const faqData = await faqResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        if (faqData.success) {
          // Transform FAQ data to match component structure
          const transformedFaqs = faqData.data.faqs.map((faq: { 
            id: string; 
            question: string; 
            answer: string; 
            category: { name: string } 
          }) => ({
            id: faq.id,
            category: faq.category.name,
            question: faq.question,
            answer: faq.answer
          }));
          setFaqs(transformedFaqs);
        }
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      }
    } catch (error) {
      console.error('Failed to load FAQ data:', error);
      toast.error('Failed to load FAQ data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async () => {
    if (newFaq.categoryId && newFaq.question && newFaq.answer) {
      try {
        const response = await fetch('/api/faq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: newFaq.question,
            answer: newFaq.answer,
            categoryId: newFaq.categoryId
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setNewFaq({ categoryId: "", categoryName: "", question: "", answer: "" });
          toast.success("FAQ added successfully!");
          // Reload data to get updated list
          loadFAQData();
        } else {
          toast.error(data.message || "Failed to add FAQ");
        }
      } catch (error) {
        console.error('Error adding FAQ:', error);
        toast.error("Failed to add FAQ");
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("FAQ deleted successfully!");
        loadFAQData();
      } else {
        toast.error(data.message || "Failed to delete FAQ");
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error("Failed to delete FAQ");
    }
  };

  const handleEditFaq = (faq: FAQItem) => {
    setEditingFaq(faq);
  };

  const handleUpdateFaq = async () => {
    if (editingFaq) {
      try {
        // Find category ID by name
        const category = categories.find(cat => cat.name === editingFaq.category);
        if (!category) {
          toast.error("Category not found");
          return;
        }

        const response = await fetch(`/api/faq/${editingFaq.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: editingFaq.question,
            answer: editingFaq.answer,
            categoryId: category.id
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setEditingFaq(null);
          toast.success("FAQ updated successfully!");
          loadFAQData();
        } else {
          toast.error(data.message || "Failed to update FAQ");
        }
      } catch (error) {
        console.error('Error updating FAQ:', error);
        toast.error("Failed to update FAQ");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingFaq(null);
  };

  const handleAddCategory = async () => {
    if (newCategory.name) {
      try {
        const response = await fetch('/api/faq/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newCategory.name,
            description: newCategory.description
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setNewCategory({ name: "", description: "" });
          toast.success("Category added successfully!");
          loadFAQData();
        } else {
          toast.error(data.message || "Failed to add category");
        }
      } catch (error) {
        console.error('Error adding category:', error);
        toast.error("Failed to add category");
      }
    } else {
      toast.error("Please enter a category name");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/faq/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Category deleted successfully!");
        loadFAQData();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Failed to delete category");
    }
  };

  const handleEditCategory = (category: FAQCategory) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory) {
      try {
        const response = await fetch(`/api/faq/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editingCategory.name,
            description: editingCategory.description
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setEditingCategory(null);
          toast.success("Category updated successfully!");
          loadFAQData();
        } else {
          toast.error(data.message || "Failed to update category");
        }
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error("Failed to update category");
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
          <p className="text-muted-foreground">Loading FAQ data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
        <p className="text-muted-foreground">
          Manage frequently asked questions and their categories
        </p>
      </div>

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
              value={newFaq.categoryId}
              onChange={(e) => {
                const selectedCategory = categories.find(cat => cat.id === e.target.value);
                setNewFaq({ 
                  ...newFaq, 
                  categoryId: e.target.value,
                  categoryName: selectedCategory?.name || "" 
                });
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
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
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>{category.name}</span>
                </div>
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
                  <p className="text-sm">Add your first FAQ using the form above.</p>
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
    </div>
  );
}