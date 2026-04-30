"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PostCardClient } from "./post-card-client";

export async function PostCard({ post }: { post: any }) {
  const session = await auth();
  const userId = session?.user?.id;

  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    include: {
      author: {
        select: { name: true, avatarUrl: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  const isSaved = await prisma.savedPost.findUnique({
    where: {
      postId_userId: {
        postId: post.id,
        userId: userId || ""
      }
    }
  });

  return (
    <PostCardClient 
      post={post} 
      initialComments={comments} 
      initialIsSaved={!!isSaved}
      currentUserId={userId}
      currentUserRole={(session?.user as any)?.role}
    />
  );
}
