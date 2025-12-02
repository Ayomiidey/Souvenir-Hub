"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Eye, RotateCcw, Save, Sparkles } from "lucide-react";
import Link from "next/link";

interface Stat {
  label: string;
  value: string;
  icon: string;
}

interface Feature {
  title: string;
  description: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface AboutPageData {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroBadgeText: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutFeatures: Feature[];
  stats: Stat[];
  storyBadgeText: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  valuesBadgeText: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values: Value[];
  ctaTitle: string;
  ctaSubtitle: string;
}

export default function AboutPageAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AboutPageData>({
    heroTitle: "Crafting Memories, One Souvenir at a Time",
    heroSubtitle: "We're not just another souvenir shop. We're memory makers, dream weavers, and passionate believers that every moment deserves to be celebrated in style.",
    heroTagline: "",
    heroBadgeText: "Since 2019",
    aboutTitle: "All About Us",
    aboutDescription: "",
    aboutFeatures: [],
    stats: [],
    storyBadgeText: "Our Journey",
    storyTitle: "From Passion to Purpose",
    storyParagraph1: "",
    storyParagraph2: "",
    storyParagraph3: "",
    valuesBadgeText: "What Drives Us",
    valuesTitle: "Our Core Values",
    valuesSubtitle: "",
    values: [],
    ctaTitle: "Ready to Create Your Perfect Souvenir?",
    ctaSubtitle: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/about");
      const result = await res.json();
      if (result && result.id) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = data.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/about", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setData(result);
        toast.success("About page content saved successfully!");
      } else {
        const errorData = await res.json();
        console.error("Save error:", errorData);
        toast.error(errorData.details || errorData.error || "Failed to save content");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  // Stats handlers
  const addStat = () => {
    setData({
      ...data,
      stats: [...data.stats, { label: "", value: "", icon: "Users" }],
    });
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, stats: newStats });
  };

  const removeStat = (index: number) => {
    toast("Are you sure you want to delete this stat?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setData({ ...data, stats: data.stats.filter((_, i) => i !== index) });
          toast.success("Stat removed successfully");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      className: "group",
      classNames: {
        cancelButton: "bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium border-0",
        actionButton: "bg-red-600 hover:bg-red-700 text-white font-medium",
      },
    });
  };

  // Features handlers
  const addFeature = () => {
    setData({
      ...data,
      aboutFeatures: [...data.aboutFeatures, { title: "", description: "" }],
    });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...data.aboutFeatures];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setData({ ...data, aboutFeatures: newFeatures });
  };

  const removeFeature = (index: number) => {
    toast("Are you sure you want to delete this feature?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setData({
            ...data,
            aboutFeatures: data.aboutFeatures.filter((_, i) => i !== index),
          });
          toast.success("Feature removed successfully");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      className: "group",
      classNames: {
        cancelButton: "bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium border-0",
        actionButton: "bg-red-600 hover:bg-red-700 text-white font-medium",
      },
    });
  };

  // Values handlers
  const addValue = () => {
    setData({
      ...data,
      values: [...data.values, { icon: "Heart", title: "", description: "" }],
    });
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const newValues = [...data.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setData({ ...data, values: newValues });
  };

  const removeValue = (index: number) => {
    toast("Are you sure you want to delete this value?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setData({ ...data, values: data.values.filter((_, i) => i !== index) });
          toast.success("Value removed successfully");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      className: "group",
      classNames: {
        cancelButton: "bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium border-0",
        actionButton: "bg-red-600 hover:bg-red-700 text-white font-medium",
      },
    });
  };

  const resetToDefaults = () => {
    if (!window.confirm("Are you sure you want to reset all content to default values? This cannot be undone.")) {
      return;
    }
    setData({
      heroTitle: "Crafting Memories, One Souvenir at a Time",
      heroSubtitle: "We're not just another souvenir shop. We're memory makers, dream weavers, and passionate believers that every moment deserves to be celebrated in style.",
      heroTagline: "",
      heroBadgeText: "Since 2019",
      aboutTitle: "All About Us",
      aboutDescription: "Souvenir Hub is Nigeria's leading platform for personalized and custom souvenirs. We help individuals, businesses, and organizations create unique, memorable keepsakes for every occasion—weddings, birthdays, corporate events, and more.",
      aboutFeatures: [
        { title: "Personalized Products", description: "Easily customize souvenirs with names, photos, logos, and messages." },
        { title: "Wide Selection", description: "Choose from hundreds of items for every event and budget." },
        { title: "Easy Ordering", description: "Seamless online experience from design to doorstep." },
        { title: "Business Solutions", description: "Bulk orders, corporate branding, and event support for organizations." },
        { title: "Nationwide Delivery", description: "Fast, reliable shipping to all states in Nigeria." },
        { title: "Exceptional Support", description: "Friendly, responsive customer service every step of the way." },
      ],
      stats: [
        { icon: "Users", label: "Happy Customers", value: "10,000+" },
        { icon: "Package", label: "Products Delivered", value: "50,000+" },
        { icon: "Smile", label: "Satisfaction Rate", value: "98%" },
        { icon: "TrendingUp", label: "Years in Business", value: "5+" },
      ],
      storyBadgeText: "Our Journey",
      storyTitle: "From Passion to Purpose",
      storyParagraph1: "It all started with a simple idea: what if every special moment could be preserved in something beautiful, tangible, and uniquely yours? In 2019, we set out to revolutionize the souvenir industry by combining traditional craftsmanship with modern customization technology.",
      storyParagraph2: "What began as a small workshop has grown into a thriving community of memory makers. Today, we serve thousands of customers across the nation, helping them celebrate life's precious moments—from weddings and birthdays to corporate events and everything in between.",
      storyParagraph3: "But we haven't forgotten our roots. Every product still receives the same care and attention that went into our very first custom order. Because at Souvenir Hub, you're not just a customer—you're part of our story.",
      valuesBadgeText: "What Drives Us",
      valuesTitle: "Our Core Values",
      valuesSubtitle: "These principles guide everything we do, from product design to customer service",
      values: [
        { icon: "Heart", title: "Customer First", description: "Every decision we make starts with you. Your satisfaction is our top priority, and we go the extra mile to ensure your experience is exceptional." },
        { icon: "Sparkles", title: "Quality Craftsmanship", description: "We believe in creating products that last. Each souvenir is carefully crafted with premium materials and attention to detail." },
        { icon: "Target", title: "Innovation", description: "We constantly evolve to bring you the latest in customization technology and design trends, making your memories truly unique." },
        { icon: "Globe2", title: "Sustainability", description: "We're committed to eco-friendly practices, from sustainable materials to responsible packaging, because we care about our planet." },
      ],
      ctaTitle: "Ready to Create Your Perfect Souvenir?",
      ctaSubtitle: "Join thousands of happy customers who trust us to preserve their special moments",
    });
    toast.success("Content reset to defaults");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-72 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-md">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header with gradient */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About Page Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage all content on the About Us page
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Link href="/about" target="_blank">
            <Button 
              variant="outline" 
              className="border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-all"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
            className="border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="shadow-lg border-l-4 border-l-blue-500 hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heroBadgeText">Badge Text</Label>
              <Input
                id="heroBadgeText"
                value={data.heroBadgeText}
                onChange={(e) =>
                  setData({ ...data, heroBadgeText: e.target.value })
                }
                placeholder="Since 2019"
              />
            </div>
            <div>
              <Label htmlFor="heroTitle">Title</Label>
              <Textarea
                id="heroTitle"
                value={data.heroTitle}
                onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
                placeholder="Main hero title"
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-semibold">Tip:</span> Use a comma <code>,</code> to break the title into two lines. <br />
                Example: <span className="italic">Crafting Memories, One Souvenir at a Time</span> will display as:<br />
                <span className="ml-2">Crafting Memories<br />One Souvenir at a Time</span>
              </p>
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Textarea
                id="heroSubtitle"
                value={data.heroSubtitle}
                onChange={(e) =>
                  setData({ ...data, heroSubtitle: e.target.value })
                }
                placeholder="Hero subtitle/description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card className="shadow-lg border-l-4 border-l-purple-500 hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex justify-between items-center text-purple-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                Stats Section
              </div>
              <Button 
                onClick={addStat} 
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Stat
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.stats.map((stat, index) => (
              <div key={index} className="p-4 border-2 border-purple-200 rounded-lg space-y-3 bg-gradient-to-br from-white to-purple-50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-purple-900 flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                    Stat {index + 1}
                  </span>
                  <Button
                    onClick={() => removeStat(index)}
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Icon (Lucide name)</Label>
                    <Input
                      value={stat.icon}
                      onChange={(e) =>
                        updateStat(index, "icon", e.target.value)
                      }
                      placeholder="Users"
                    />
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) =>
                        updateStat(index, "value", e.target.value)
                      }
                      placeholder="10,000+"
                    />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) =>
                        updateStat(index, "label", e.target.value)
                      }
                      placeholder="Happy Customers"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="shadow-lg border-l-4 border-l-pink-500 hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50">
            <CardTitle className="text-pink-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-pink-600 to-orange-600 rounded-full"></div>
              About Souvenir Hub Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="aboutTitle">Section Title</Label>
              <Input
                id="aboutTitle"
                value={data.aboutTitle}
                onChange={(e) => setData({ ...data, aboutTitle: e.target.value })}
                placeholder="All About Us"
              />
            </div>
            <div>
              <Label htmlFor="aboutDescription">Description</Label>
              <Textarea
                id="aboutDescription"
                value={data.aboutDescription}
                onChange={(e) =>
                  setData({ ...data, aboutDescription: e.target.value })
                }
                placeholder="Detailed description of the business"
                rows={5}
              />
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold text-pink-900">Features List</Label>
              <Button 
                onClick={addFeature} 
                size="sm"
                className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Feature
              </Button>
            </div>

            {data.aboutFeatures.map((feature, index) => (
              <div key={index} className="p-4 border-2 border-pink-200 rounded-lg space-y-3 bg-gradient-to-br from-white to-pink-50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-pink-900 flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-gradient-to-b from-pink-600 to-orange-600 rounded-full"></div>
                    Feature {index + 1}
                  </span>
                  <Button
                    onClick={() => removeFeature(index)}
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) =>
                      updateFeature(index, "title", e.target.value)
                    }
                    placeholder="Feature title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(index, "description", e.target.value)
                    }
                    placeholder="Feature description"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card className="shadow-lg border-l-4 border-l-blue-500 hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
              Our Story Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storyBadgeText">Badge Text</Label>
              <Input
                id="storyBadgeText"
                value={data.storyBadgeText}
                onChange={(e) =>
                  setData({ ...data, storyBadgeText: e.target.value })
                }
                placeholder="Our Journey"
              />
            </div>
            <div>
              <Label htmlFor="storyTitle">Title</Label>
              <Input
                id="storyTitle"
                value={data.storyTitle}
                onChange={(e) =>
                  setData({ ...data, storyTitle: e.target.value })
                }
                placeholder="From Passion to Purpose"
              />
            </div>
            <div>
              <Label htmlFor="storyParagraph1">Paragraph 1</Label>
              <Textarea
                id="storyParagraph1"
                value={data.storyParagraph1}
                onChange={(e) =>
                  setData({ ...data, storyParagraph1: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="storyParagraph2">Paragraph 2</Label>
              <Textarea
                id="storyParagraph2"
                value={data.storyParagraph2}
                onChange={(e) =>
                  setData({ ...data, storyParagraph2: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="storyParagraph3">Paragraph 3</Label>
              <Textarea
                id="storyParagraph3"
                value={data.storyParagraph3}
                onChange={(e) =>
                  setData({ ...data, storyParagraph3: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card className="shadow-lg border-l-4 border-l-purple-500 hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="flex justify-between items-center text-purple-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
                Core Values Section
              </div>
              <Button 
                onClick={addValue} 
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Value
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="valuesBadgeText">Badge Text</Label>
              <Input
                id="valuesBadgeText"
                value={data.valuesBadgeText}
                onChange={(e) =>
                  setData({ ...data, valuesBadgeText: e.target.value })
                }
                placeholder="What Drives Us"
              />
            </div>
            <div>
              <Label htmlFor="valuesTitle">Title</Label>
              <Input
                id="valuesTitle"
                value={data.valuesTitle}
                onChange={(e) =>
                  setData({ ...data, valuesTitle: e.target.value })
                }
                placeholder="Our Core Values"
              />
            </div>
            <div>
              <Label htmlFor="valuesSubtitle">Subtitle</Label>
              <Textarea
                id="valuesSubtitle"
                value={data.valuesSubtitle}
                onChange={(e) =>
                  setData({ ...data, valuesSubtitle: e.target.value })
                }
                rows={2}
              />
            </div>

            <Separator className="my-4" />

            {data.values.map((value, index) => (
              <div key={index} className="p-4 border-2 border-purple-200 rounded-lg space-y-3 bg-gradient-to-br from-white to-purple-50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-purple-900 flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
                    Value {index + 1}
                  </span>
                  <Button
                    onClick={() => removeValue(index)}
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Icon (Lucide name)</Label>
                    <Input
                      value={value.icon}
                      onChange={(e) =>
                        updateValue(index, "icon", e.target.value)
                      }
                      placeholder="Heart"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={value.title}
                      onChange={(e) =>
                        updateValue(index, "title", e.target.value)
                      }
                      placeholder="Customer First"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={value.description}
                    onChange={(e) =>
                      updateValue(index, "description", e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-lg border-l-4 border-l-pink-500 hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
            <CardTitle className="text-pink-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-pink-600 to-rose-600 rounded-full"></div>
              CTA Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ctaTitle">Title</Label>
              <Input
                id="ctaTitle"
                value={data.ctaTitle}
                onChange={(e) => setData({ ...data, ctaTitle: e.target.value })}
                placeholder="Ready to Create Your Perfect Souvenir?"
              />
            </div>
            <div>
              <Label htmlFor="ctaSubtitle">Subtitle</Label>
              <Textarea
                id="ctaSubtitle"
                value={data.ctaSubtitle}
                onChange={(e) =>
                  setData({ ...data, ctaSubtitle: e.target.value })
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Icon Reference Card */}
        <Card className="shadow-lg border-l-4 border-l-indigo-500 hover:shadow-xl transition-shadow bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardHeader className="bg-gradient-to-r from-indigo-100 to-blue-100">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"></div>
              📚 Icon Reference Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 mb-3">
              Use any icon name from Lucide React. Common icons include:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="bg-white p-2 rounded border border-blue-200">
                <code className="text-blue-600">Heart</code>, <code className="text-blue-600">Sparkles</code>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <code className="text-blue-600">Users</code>, <code className="text-blue-600">Package</code>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <code className="text-blue-600">Target</code>, <code className="text-blue-600">Globe2</code>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <code className="text-blue-600">Smile</code>, <code className="text-blue-600">TrendingUp</code>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <code className="text-blue-600">Award</code>, <code className="text-blue-600">Rocket</code>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <code className="text-blue-600">Shield</code>, <code className="text-blue-600">Star</code>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <code className="text-blue-600">Zap</code>, <code className="text-blue-600">Leaf</code>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <code className="text-blue-600">Gift</code>, <code className="text-blue-600">Check</code>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-3">
              💡 Tip: Visit{" "}
              <a
                href="https://lucide.dev/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                lucide.dev/icons
              </a>{" "}
              for the complete list of available icons
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={fetchData}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Discard Changes
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving} 
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
