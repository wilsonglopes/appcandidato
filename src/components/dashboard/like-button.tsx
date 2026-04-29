"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/lib/actions";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialHasLiked: boolean;
}

export function LikeButton({ postId, initialLikes, initialHasLiked }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      await toggleLikeAction(postId);
    });
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 text-xs transition-all hover:scale-110 active:scale-95 ${
        initialHasLiked ? "text-red-500 fill-red-500" : "hover:text-red-500"
      }`}
    >
      <Heart className={`w-4 h-4 ${initialHasLiked ? "fill-current" : ""}`} />
      <span>{initialLikes} {initialLikes === 1 ? "Curtida" : "Curtidas"}</span>
    </button>
  );
}
