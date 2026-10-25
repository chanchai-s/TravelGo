"use client";

import { useEffect, useState, useRef } from "react";
import { apiGetMediaFeed, apiToggleMediaLike } from "@/app/Api/mainApi";

interface VideoItem {
  id: string;
  url?: string;
  images?: string[]; // URL ของวิดีโอ/รูป
  name: string;
  location: string;
  pricePerNight: number;
  rating?: number;
  reviews?: number;
  likes?: number;
  comments?: number;
}

export default function MediaPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

  const videoRef = useRef<HTMLVideoElement>(null);

  const loadVideos = async () => {
    try {
      const res = await apiGetMediaFeed();
      const data = (res.data ?? {}) as { data?: VideoItem[] };
      if (data.data) {
        setVideos(data.data);
      }
    } catch (err) {
      console.error("โหลดวิดีโอไม่สำเร็จ", err);
    } finally {
      setLoading(false);
    }
  };

  const likeVideo = async (videoId: string) => {
    try {
      const res = await apiToggleMediaLike(videoId);
      const data = (res.data ?? {}) as { data?: { liked?: boolean; likes?: number } };
      setLikedVideos((prev) => {
        const newSet = new Set(prev);
        if (data.data?.liked) newSet.add(videoId);
        else newSet.delete(videoId);
        return newSet;
      });
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, likes: data.data?.likes ?? v.likes ?? 0 } : v,
        ),
      );
    } catch (err) {
      console.error("กดไลก์ไม่สำเร็จ", err);
    }
  };

  const nextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentVideo = videos[currentIndex];

  useEffect(() => {
    loadVideos();
  }, []);

  if (loading || !videos.length) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <span className="material-symbols-outlined text-4xl">search</span>
          <p>กำลังโหลดวิดีโอ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      {/* Video player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onEnded={() => setCurrentIndex((prev) => (prev + 1) % videos.length)}
      >
        <source src={currentVideo?.url || currentVideo?.images?.[0] || ""} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Right sidebar: Like, Comment, Share */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        <button
          type="button"
          onClick={() => likeVideo(currentVideo.id)}
          className="w-12 h-12 rounded-full bg-white/10 flex flex-col items-center justify-center items-center text-white text-xl shadow-lg hover:bg-white/20 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">{likedVideos.has(currentVideo.id) ? "favorite" : "favorite_border"}</span>
          <span className="mt-1 text-xs font-bold">{currentVideo?.likes ?? 0}</span>
        </button>
        <button
          type="button"
          className="w-12 h-12 rounded-full bg-white/10 flex flex-col items-center justify-center text-white text-xl shadow-lg hover:bg-white/20 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">comment</span>
          <span className="mt-1 text-[10px]">{currentVideo?.comments ?? 0}</span>
        </button>
        <button
          type="button"
          className="w-12 h-12 rounded-full bg-white/10 flex flex-col items-center justify-center text-white text-xl shadow-lg hover:bg-white/20 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
      </div>

      {/* Next/Prev buttons */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          type="button"
          onClick={prevVideo}
          disabled={currentIndex === 0}
          className="rounded-full bg-white/20 px-4 py-2 text-white font-bold shadow-lg disabled:opacity-30 hover:bg-white/30 transition-all"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextVideo}
          className="w-full rounded-xl bg-white px-6 py-2 font-label-md text-label-md font-bold text-on-surface shadow-sm shadow-lg disabled:opacity-30 hover:bg-white/30 transition-all"
        >
          Next Video
        </button>
      </div>

      {/* Bottom video thumbnails */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`h-12 w-12 shrink-0 rounded-xl overflow-hidden border-2 ${currentIndex === index ? "border-white" : "border-transparent/50"} cursor-pointer`}
            onClick={() => setCurrentIndex(index)}
          >
            <img src={video.url ?? video.images?.[0] ?? ""} alt={video.name} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}