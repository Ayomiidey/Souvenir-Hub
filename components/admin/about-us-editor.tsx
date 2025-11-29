"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface AboutUsEditorProps {
  content: string;
  onSave: (content: string) => void;
  loading: boolean;
}

export default function AboutUsEditor({ content, onSave, loading }: AboutUsEditorProps) {
  const [internalContent, setInternalContent] = useState(content);
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    onUpdate: ({ editor }) => {
      setInternalContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== internalContent) {
      editor.commands.setContent(content || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <div>
      <div className="border rounded mb-4">
        {editor && <EditorContent editor={editor} />}
      </div>
      <Button onClick={() => onSave(internalContent)} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}
