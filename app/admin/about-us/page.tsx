"use client";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export default function AdminAboutUsPage() {

  const [content, setContent] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/about-us")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.content) {
          setContent(data.content);
          setId(data.id);
        }
      });
  }, []);

  const handleSave = async (newContent: string) => {
    setLoading(true);
    try {
      const method = id ? "PATCH" : "POST";
      const res = await fetch("/api/about-us", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id, content: newContent } : { content: newContent }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setId(data.id);
      setContent(data.content);
      toast.success("About Us content saved.");
    } catch {
      toast.error("Failed to save About Us content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit About Us Page</h1>
      <div className="mb-4">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write About Us content..."
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={() => handleSave(content)}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
