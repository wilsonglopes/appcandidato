"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LikeButton } from "./like-button";
import { MessageCircle, Share2, Bookmark, Download, Send, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { createCommentAction, toggleSaveAction, deletePostAction, updatePostAction } from "@/lib/actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function PostCardClient({ post, initialComments, initialIsSaved, currentUserId, currentUserRole }: any) {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para edição e exclusão
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);

  const isAdmin = currentUserRole === "ADMIN";
  const isAuthor = currentUserId === post.author.id;

  const handleEdit = async () => {
    if (!editContent.trim() || isActionPending) return;
    setIsActionPending(true);
    const result = await updatePostAction(post.id, editContent);
    if (result.success) {
      toast.success("Postagem atualizada!");
      setIsEditing(false);
    } else {
      toast.error(result.error || "Erro ao editar.");
    }
    setIsActionPending(false);
  };

  const handleDelete = async () => {
    if (isActionPending) return;
    setIsActionPending(true);
    const result = await deletePostAction(post.id);
    if (result.success) {
      toast.success("Postagem excluída.");
      setIsDeleting(false);
      // O revalidatePath cuidará do refresh, mas poderíamos esconder localmente se quiséssemos.
    } else {
      toast.error(result.error || "Erro ao excluir.");
    }
    setIsActionPending(false);
  };

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
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isSaved ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={handleSave}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>

          {(isAdmin || (post.imageUrl || post.videoUrl)) && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-40">
                {(post.imageUrl || post.videoUrl) && (
                  <DropdownMenuItem onClick={handleDownload} className="gap-2">
                    <Download className="w-4 h-4" /> Baixar Mídia
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-2">
                      <Pencil className="w-4 h-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDeleting(true)} className="gap-2 text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4" /> Excluir
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Dialog de Edição */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Postagem</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[120px]"
                placeholder="O que você quer dizer?"
              />
            </div>
            <DialogFooter className="flex-row justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isActionPending}>
                Cancelar
              </Button>
              <Button onClick={handleEdit} disabled={isActionPending || !editContent.trim()}>
                {isActionPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Exclusão */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Excluir Postagem?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.
            </p>
            <DialogFooter className="flex-row justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsDeleting(false)} disabled={isActionPending}>
                Manter
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isActionPending}>
                {isActionPending ? "Excluindo..." : "Sim, Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Preview de Imagem */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90 border-none">
            <div className="relative w-full h-full flex items-center justify-center p-4">
               {post.imageUrl && (
                 <img src={post.imageUrl} alt="Full preview" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
               )}
               {post.videoUrl && (
                 <video src={post.videoUrl} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
               )}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {(post.imageUrl || post.videoUrl) && (
          <div className="relative group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post content" className="rounded-xl w-full object-cover max-h-96 transition-transform hover:scale-[1.01]" />
            )}
            {post.videoUrl && (
              <div className="relative">
                <video src={post.videoUrl} className="rounded-xl w-full max-h-96 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                      <MoreVertical className="w-8 h-8 text-white rotate-90" />
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3 flex items-center justify-between text-muted-foreground px-4">
        <LikeButton postId={post.id} initialLikes={post._count.likes} initialHasLiked={post.likes.length > 0} />
        
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-xs hover:text-primary transition-colors h-8"
        >
          <MessageCircle className="w-4 h-4" /> 
          <span className="hidden xs:inline">Comentar</span>
          <span>({comments.length})</span>
        </Button>
        
        <Button 
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2 text-xs hover:text-primary transition-colors h-8"
        >
          <Share2 className="w-4 h-4" /> 
          <span>Compartilhar</span>
        </Button>
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
