import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessagesPage() {
  return (
    <div className="p-4 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">Mensagens</h2>
      </div>

      <Card className="flex-1 border-none shadow-sm flex flex-col min-h-[500px]">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Suporte da Campanha
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex gap-3 max-w-[80%]">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-sm">
                <p>Olá! Este é o canal direto com a coordenação da campanha. Como podemos ajudar hoje?</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">Campanha Oficial</span>
              </div>
            </div>
            
            <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none text-sm shadow-md shadow-primary/20">
                <p>Oi, gostaria de saber como posso ajudar na distribuição dos panfletos no meu bairro.</p>
                <span className="text-[10px] text-primary-foreground/70 mt-1 block">Agora mesmo</span>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input placeholder="Escreva sua mensagem..." className="rounded-full bg-muted border-none focus-visible:ring-primary" />
              <Button size="icon" className="rounded-full shrink-0 shadow-lg shadow-primary/20">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
        Sua privacidade é nossa prioridade. Mensagens são criptografadas.
      </p>
    </div>
  );
}
