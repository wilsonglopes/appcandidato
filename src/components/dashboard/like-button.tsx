"use client";

import { useTransition, useOptimistic } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/lib/actions";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialHasLiked: boolean;
}

export function LikeButton({ postId, initialLikes, initialHasLiked }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  
  // Hook do React 18/19 para atualização imediata (otimista) da UI
  const [optimisticState, addOptimisticState] = useOptimistic(
    { likes: initialLikes, hasLiked: initialHasLiked },
    (state) => ({
      likes: state.hasLiked ? state.likes - 1 : state.likes + 1,
      hasLiked: !state.hasLiked
    })
  );

  const handleLike = () => {
    // 1. Atualiza a interface instantaneamente
    startTransition(async () => {
      addOptimisticState(null);
      // 2. Chama o servidor em segundo plano
      await toggleLikeAction(postId);
    });
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 text-xs transition-all hover:scale-110 active:scale-95 ${
        optimisticState.hasLiked ? "text-red-500 fill-red-500" : "hover:text-red-500"
      }`}
    >
      <Heart className={`w-4 h-4 ${optimisticState.hasLiked ? "fill-current" : ""}`} />
      <span>{optimisticState.likes} {optimisticState.likes === 1 ? "Curtida" : "Curtidas"}</span>
    </button>
  );
}
