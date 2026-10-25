"use client";

import { useEffect, useRef, useState } from "react";
import { apiListUserPosts, apiToggleUserPostLike, apiUploadMedia, apiCreateUserPost, apiGetMediaComments, apiAddMediaComment } from "@/app/Api/mainApi";

interface Post {
  id: string;
  url: string;
  type: string;
  caption?: string;
  likes: number;
  user?: { id: string; name: string };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activePost, setActivePost] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [page, setPage] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const up = await apiUploadMedia(file);
      const data = (up.data ?? {}) as { data?: { url?: string; type?: string } };
      const url = data.data?.url;
      if (!url) throw new Error("no url");
      const type = file.type.startsWith("video") ? "video" : "image";
      const created = await apiCreateUserPost({ url, type, caption: file.name });
      const postData = (created.data ?? {}) as { data?: Post };
      if (postData.data) setPosts((prev) => [postData.data as Post, ...prev]);
    } catch (err) {
      console.error("upload failed", err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  useEffect(() => {
    apiListUserPosts(1, 30)
      .then((res) => {
        const data = (res.data ?? {}) as { data?: Post[] };
        setPosts(data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const like = async (id: string) => {
    try {
      const res = await apiToggleUserPostLike(id);
      const data = (res.data ?? {}) as { data?: { likes?: number } };
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes: data.data?.likes ?? p.likes } : p)),
      );
    } catch {}
  };

  const openComments = async (id: string) => {
    setActivePost(id);
    try {
      const res = await apiGetMediaComments(id);
      const data = (res.data ?? {}) as { data?: any[] };
      setComments(data.data ?? []);
    } catch {
      setComments([]);
    }
  };

  const addComment = async () => {
    if (!activePost || !commentText.trim()) return;
    try {
      await apiAddMediaComment(activePost, commentText.trim());
      const res = await apiGetMediaComments(activePost);
      const data = (res.data ?? {}) as { data?: any[] };
      setComments(data.data ?? []);
      setCommentText("");
    } catch {}
  };

  const share = (id: string) => {
    const url = `${window.location.origin}/posts#${id}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url);
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    try {
      const res = await apiListUserPosts(nextPage, 20);
      const data = (res.data ?? {}) as { data?: Post[] };
      const more = data.data ?? [];
      if (more.length > 0) {
        setPosts((prev) => [...prev, ...more]);
        setPage(nextPage);
      }
    } catch {}
  };

  if (loading) return <div className="p-8 text-center">กำลังโหลด...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">โพสต์</h1>
        <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          {uploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      </div>
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-4" onScroll={(e) => {
        const el = e.currentTarget;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 50) {
          loadMore();
        }
      }}>
        {posts.map((p) => (
          <div key={p.id} className="relative w-64 h-64 shrink-0 snap-start bg-gray-100">
            {p.type === "video" ? (
              <video src={p.url} className="w-full h-full object-cover" muted />
            ) : (
              <img src={p.url} alt={p.caption || ""} className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-2 right-2 flex gap-1">
              <button
                onClick={() => like(p.id)}
                className="bg-black/50 text-white text-xs px-2 py-1 rounded"
              >
                ❤ {p.likes}
              </button>
              <button
                onClick={() => openComments(p.id)}
                className="bg-black/50 text-white text-xs px-2 py-1 rounded"
              >
                💬
              </button>
              <button
                onClick={() => share(p.id)}
                className="bg-black/50 text-white text-xs px-2 py-1 rounded"
              >
                🔗
              </button>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 && <p className="text-center text-gray-500 mt-8">ยังไม่มีโพสต์</p>}

      {activePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setActivePost(null)}>
          <div className="bg-white rounded p-4 w-full max-w-md max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold mb-2">ความคิดเห็น</h2>
            <div className="space-y-2 mb-3">
              {comments.map((c) => (
                <div key={c.id} className="text-sm border-b pb-1">
                  <span className="font-semibold">{c.user?.name || "user"}: </span>
                  {c.text}
                </div>
              ))}
              {comments.length === 0 && <p className="text-gray-400 text-sm">ยังไม่มีความคิดเห็น</p>}
            </div>
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="เพิ่มความคิดเห็น..."
              />
              <button onClick={addComment} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                ส่ง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
