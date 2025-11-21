"use client";

import { useState, useEffect } from "react";
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-10 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse"></div>
          </div>

          {/* Category Management Section Skeleton */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100/50 shadow-sm mb-6">
            <div className="mb-6">
              <div className="h-6 bg-gradient-to-r from-indigo-200 to-blue-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-80 mt-2 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-10 bg-white/80 rounded-lg flex-1 animate-pulse"></div>
                <div className="h-10 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-lg w-32 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/60 rounded-lg border border-gray-200">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Management Section Skeleton */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100/50 shadow-sm mb-6">
            <div className="mb-6">
              <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-72 mt-2 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-10 bg-white/80 rounded-lg w-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-white/80 rounded-lg w-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-24 bg-white/80 rounded-lg w-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-24 bg-white/80 rounded-lg w-full animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* FAQ List Section Skeleton */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100/50 shadow-sm">
            <div className="mb-6">
              <div className="h-6 bg-gradient-to-r from-green-200 to-emerald-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            FAQ Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage frequently asked questions and their categories
          </p>
        </div>

        {/* Category Management Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100/50 shadow-sm mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
              FAQ Categories ({categories.length})
            </h2>
            <p className="text-gray-600 text-sm">
              Organize your FAQs into categories
            </p>
          </div>

          {/* Add New Category Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add New Category</h3>
                <p className="text-sm text-gray-600">Create a new FAQ category</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g., Orders & Shipping, Returns, Products"
                  className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryDescription" className="text-sm font-medium text-gray-700">Description (Optional)</Label>
                <Input
                  id="categoryDescription"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Brief description of this category"
                  className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button
              onClick={handleAddCategory}
              disabled={!newCategory.name}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Existing Categories */}
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                {editingCategory?.id === category.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Category Name</Label>
                        <Input
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          placeholder="Category name"
                          className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Description</Label>
                        <Input
                          value={editingCategory.description || ""}
                          onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                          placeholder="Category description"
                          className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleUpdateCategory}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCategory(null)}
                        className="bg-white/80 hover:bg-white border-gray-200"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 ml-11">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-11 mt-1">
                        {faqs.filter(faq => faq.category === category.name).length} FAQ(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                        className="bg-white/80 hover:bg-white border-gray-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="bg-white/80 hover:bg-white border-gray-200 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New FAQ Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100/50 shadow-sm mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              Add New FAQ
            </h2>
            <p className="text-gray-600 text-sm">
              Create a new frequently asked question
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
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
                  className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50/50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                <Label htmlFor="question" className="text-sm font-medium text-gray-700">Question</Label>
                <Input
                  id="question"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  placeholder="Enter the question"
                  className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer" className="text-sm font-medium text-gray-700">Answer</Label>
                <Textarea
                  id="answer"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  placeholder="Enter the answer"
                  rows={4}
                  className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <Button
                onClick={handleAddFaq}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </div>
        </div>

        {/* Existing FAQs by Category */}
        {categories.map((category) => {
          const categoryFaqs = faqs.filter(faq => faq.category === category.name);

          return (
            <div key={category.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100/50 shadow-sm mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  {category.name} ({categoryFaqs.length})
                </h2>
                <p className="text-gray-600 text-sm">
                  {category.description && `${category.description} • `}
                  {categoryFaqs.length} question{categoryFaqs.length !== 1 ? 's' : ''}
                </p>
              </div>

              {categoryFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No FAQs in this category yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first FAQ using the form above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryFaqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      {editingFaq?.id === faq.id ? (
                        <div className="p-6 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Category</Label>
                            <select
                              value={editingFaq.category}
                              onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                              className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            >
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Question</Label>
                            <Input
                              value={editingFaq.question}
                              onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                              placeholder="Enter the question"
                              className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Answer</Label>
                            <Textarea
                              value={editingFaq.answer}
                              onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                              placeholder="Enter the answer"
                              rows={4}
                              className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleUpdateFaq}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="bg-white/80 hover:bg-white border-gray-200"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <HelpCircle className="w-4 h-4 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 leading-tight">{faq.question}</h4>
                              </div>
                              <p className="text-sm text-gray-600 ml-11 leading-relaxed">{faq.answer}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditFaq(faq)}
                                className="bg-white/80 hover:bg-white border-gray-200 text-purple-600 hover:text-purple-700 hover:border-purple-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="bg-white/80 hover:bg-white border-gray-200 text-red-600 hover:text-red-700 hover:border-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}