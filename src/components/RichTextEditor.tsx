"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import MediaLibrary from "@/components/MediaLibrary";
import VideoUploader from "@/components/VideoUploader";

const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      provider: { default: "video" },
      originalUrl: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-video-embed="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-video-embed": "true",
        class: "rhevolver-video-embed",
      }),
      [
        "iframe",
        {
          src: HTMLAttributes.src,
          title: "Video incorporado",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: "true",
          loading: "lazy",
        },
      ],
    ];
  },
});

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

function getVideoEmbed(url: string) {
  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id
        ? { src: `https://www.youtube.com/embed/${id}`, provider: "youtube" }
        : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/shorts/")[1]?.split("/")[0] ||
        parsed.pathname.split("/embed/")[1]?.split("/")[0];
      return id
        ? { src: `https://www.youtube.com/embed/${id}`, provider: "youtube" }
        : null;
    }

    if (parsed.hostname.includes("facebook.com") || parsed.hostname.includes("fb.watch")) {
      return {
        src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url.trim()
        )}&show_text=false&width=800`,
        provider: "facebook",
      };
    }

    return null;
  } catch {
    return null;
  }
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const [uploadVideoOpen, setUploadVideoOpen] = useState(false);
  const [videoError, setVideoError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false, inline: false }),
      VideoEmbed,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] px-5 py-4 text-white outline-none [&_p]:mb-4 [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-3xl [&_h2]:font-black [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-2xl [&_h3]:font-bold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-pink-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-300 [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_.rhevolver-video-embed]:my-7 [&_.rhevolver-video-embed]:aspect-video [&_.rhevolver-video-embed]:overflow-hidden [&_.rhevolver-video-embed]:rounded-2xl [&_.rhevolver-video-embed]:bg-black [&_.rhevolver-video-embed_iframe]:h-full [&_.rhevolver-video-embed_iframe]:w-full",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.isFocused || value === editor.getHTML()) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#090a10] p-5 text-zinc-500">
        Cargando editor…
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
    editor.chain().focus().setImage({ src: url }).run();
  }

  function insertGallery(urls: string[]) {
    if (!editor || urls.length === 0) return;
    const content = [
      { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Galería" }] },
      ...urls.flatMap((url) => [
        { type: "image", attrs: { src: url, alt: "Galería Rhevolver" } },
        { type: "paragraph" },
      ]),
    ];
    editor.chain().focus().insertContent(content).run();
  }

  function insertUploadedVideo(url: string) {
    if (!editor) return;
    editor.chain().focus().insertContent(`<video controls playsinline preload="metadata" src="${url}"></video><p></p>`).run();
    setUploadVideoOpen(false);
  }

  function insertVideo() {
    if (!editor) return;
    setVideoError("");
    const embed = getVideoEmbed(videoUrl);

    if (embed) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "videoEmbed",
          attrs: {
            src: embed.src,
            provider: embed.provider,
            originalUrl: videoUrl.trim(),
          },
        })
        .run();
      setVideoUrl("");
      setVideoOpen(false);
      return;
    }

    if (videoUrl.includes("tiktok.com")) {
      editor
        .chain()
        .focus()
        .insertContent(
          `<p><strong>Video en TikTok:</strong> <a href="${videoUrl.trim()}" target="_blank" rel="noopener noreferrer">Ver video original</a></p>`
        )
        .run();
      setVideoUrl("");
      setVideoOpen(false);
      return;
    }

    setVideoError(
      "Usa un enlace válido de YouTube, Facebook Video o TikTok."
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090a10]">
        <div className="flex flex-wrap gap-2 border-b border-white/10 bg-[#11131c] p-3">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive("bold"))}>B</button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive("italic"))}>I</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive("heading", { level: 2 }))}>H2</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass(editor.isActive("heading", { level: 3 }))}>H3</button>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive("bulletList"))}>• Lista</button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive("orderedList"))}>1. Lista</button>
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass(editor.isActive("blockquote"))}>Cita</button>
          <button type="button" onClick={() => setMediaOpen(true)} className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10">🖼 Imagen</button>
          <button type="button" onClick={() => setGalleryOpen(true)} className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10">▦ Galería</button>
          <button type="button" onClick={() => setVideoOpen((value) => !value)} className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10">▶ Enlace</button>
          <button type="button" onClick={() => setUploadVideoOpen((value) => !value)} className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10">↑ Subir video</button>
          <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">↶</button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">↷</button>
        </div>

        {videoOpen && (
          <div className="border-b border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="Pega un enlace de YouTube, Facebook Video o TikTok"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-pink-500"
              />
              <button type="button" onClick={insertVideo} className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-black text-white hover:bg-pink-500">Insertar video</button>
            </div>
            {videoError && <p className="mt-2 text-sm text-red-300">{videoError}</p>}
          </div>
        )}

        {uploadVideoOpen && <div className="border-b border-white/10 p-4"><VideoUploader onUploaded={insertUploadedVideo} /></div>}
        <EditorContent editor={editor} />
      </div>

      <MediaLibrary open={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={insertImage} />
      <MediaLibrary open={galleryOpen} onClose={() => setGalleryOpen(false)} multiple onSelectMultiple={insertGallery} />
    </>
  );
}
