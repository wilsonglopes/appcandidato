"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LikeButton } from "./like-button";
import { MessageCircle, Share2, Bookmark, Download, Send } from "lucide-react";
import { createCommentAction, toggleSaveAction } from "@/lib/actions";
import { toast } from "sonner";

export function PostCardClient({ post, initialComments, initialIsSaved, currentUserId }: any) {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await createCommentAction(post.id, commentContent);
    
    if (result.success) {
      // Adição otimista (simulada)
      const newComment = {
        id: Math.random().toString(),
        content: commentContent,
        createdAt: new Date(),
        author: { 
          name: "Você", 
          avatarUrl: (result as any).userAvatar || null 
        }
      };
      setComments([...comments, newComment]);
      setCommentContent("");
      toast.success("Comentário enviado!");
    } else {
      toast.error("Erro ao comentar.");
    }
    setIsSubmitting(false);
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    const result = await toggleSaveAction(post.id);
    if (!result.success) {
      setIsSaved(!isSaved);
      toast.error("Erro ao salvar.");
    } else {
      toast.success(isSaved ? "Removido dos salvos" : "Postagem salva!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mensagem da Campanha",
          text: post.content,
        });
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      navigator.clipboard.writeText(post.content);
      toast.success("Texto copiado!");
    }
  };

  const handleDownload = () => {
    const url = post.imageUrl || post.videoUrl;
    if (!url) return;
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `candidato_midia_${post.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Iniciando download...");
  };

  return (
    <Card className="border-none shadow-sm animate-in fade-in duration-500">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatarUrl} />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
            {post.author.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{post.author.name}</span>
            <Badge variant="outline" className="text-[10px] h-4 px-1 uppercase">{post.author.role}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${isSaved ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={handleSave}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {(post.imageUrl || post.videoUrl) && (
          <div className="relative group">
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post content" className="rounded-xl w-full object-cover max-h-96" />
            )}
            {post.videoUrl && (
              <video src={post.videoUrl} controls className="rounded-xl w-full max-h-96" />
            )}
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" /> Baixar
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3 flex items-center justify-between text-muted-foreground">
        <LikeButton postId={post.id} initialLikes={post._count.likes} initialHasLiked={post.likes.length > 0} />
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Comentar ({comments.length})
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
        >
          <Share2 className="w-4 h-4" /> Compartilhar
        </button>
      </CardFooter>

      {showComments && (
        <div className="px-6 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="pt-2 border-t space-y-3">
            {comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-3 items-start">
                <Avatar className="h-7 w-7">
                  {comment.author.avatarUrl ? (
                    <AvatarImage src={comment.author.avatarUrl} />
                  ) : (
                    <AvatarFallback className="text-[10px] bg-muted">{comment.author.name[0]}</AvatarFallback>
                  )}
                </Avatar>
                <div className="bg-muted/50 p-2 rounded-2xl flex-1">
                  <p className="text-[11px] font-bold">{comment.author.name}</p>
                  <p className="text-xs">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleComment} className="flex gap-2 items-center">
            <Input 
              placeholder="Escreva um comentário..." 
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="h-9 text-xs bg-muted/50 border-none rounded-full"
            />
            <Button size="icon" className="h-9 w-9 rounded-full shrink-0" disabled={!commentContent.trim() || isSubmitting}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}
