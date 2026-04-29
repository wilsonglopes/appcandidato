"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createPostAction } from "@/lib/actions";
import { Send, Image as ImageIcon, Video, Loader2 } from "lucide-react";

export function CreatePostForm({ userName }: { userName: string }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const userInitial = userName.charAt(0).toUpperCase();

  const handlePost = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await createPostAction(content);
      if (result.success) {
        setContent("");
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <Card className="border-none shadow-sm mb-6 overflow-hidden animate-in">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{userInitial}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder={`O que está acontecendo na campanha, ${userName}?`}
              className="min-h-[100px] bg-muted/30 border-none focus-visible:ring-primary/20 resize-none text-base p-3 rounded-xl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
            />
            
            <div className="flex items-center justify-between pt-2 border-t border-muted/50">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
                  <Video className="w-5 h-5" />
                </Button>
              </div>

              <Button 
                onClick={handlePost} 
                disabled={isPending || !content.trim()}
                className="rounded-xl px-6 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Postando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publicar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
