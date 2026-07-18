"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import MediaLibrary from "@/components/MediaLibrary";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [mediaOpen, setMediaOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: false,
        inline: false,
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] px-5 py-4 text-white outline-none [&_p]:mb-4 [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-3xl [&_h2]:font-black [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-2xl [&_h3]:font-bold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-pink-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-300 [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#090a10] p-5 text-zinc-500">
        Cargando editor...
      </div>
    );
  }

  const buttonClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-bold transition ${
      active
        ? "bg-pink-600 text-white"
        : "bg-white/5 text-zinc-300 hover:bg-white/10"
    }`;

  function insertImage(url: string) {
  if (!editor) return;

  const inserted = editor
    .chain()
    .focus()
    .setImage({
      src: url,
    })
    .run();

    if (!inserted) {
      window.alert("No se pudo insertar la imagen.");
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090a10]">
        <div className="flex flex-wrap gap-2 border-b border-white/10 bg-[#11131c] p-3">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={buttonClass(editor.isActive("bold"))}
          >
            B
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={buttonClass(editor.isActive("italic"))}
          >
            I
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={buttonClass(editor.isActive("heading", { level: 2 }))}
          >
            H2
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={buttonClass(editor.isActive("heading", { level: 3 }))}
          >
            H3
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={buttonClass(editor.isActive("bulletList"))}
          >
            • Lista
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={buttonClass(editor.isActive("orderedList"))}
          >
            1. Lista
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={buttonClass(editor.isActive("blockquote"))}
          >
            Cita
          </button>

          <button
            type="button"
            onClick={() => setMediaOpen(true)}
            className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
          >
            🖼 Imagen
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↶
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↷
          </button>
        </div>

        <EditorContent editor={editor} />
      </div>

      <MediaLibrary
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={insertImage}
      />
    </>
  );
}