"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateProfileAction } from "@/lib/actions";
import { toast } from "sonner";
import { User, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileForm({ 
  initialName, 
  initialAvatar 
}: { 
  initialName: string, 
  initialAvatar: string | null 
}) {
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialAvatar || "");
  const [isLoading, setIsLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("avatarUrl", avatarUrl);
      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }

      const result = await updateProfileAction(formData);
      if (result.success) {
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Editar Perfil</CardTitle>
        <CardDescription>Mantenha seus dados atualizados na campanha.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Avatar className="h-24 w-24 border-2 border-primary/20">
              <AvatarImage src={previewUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <Label htmlFor="avatarFile" className="cursor-pointer">
                <div className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                  <Camera className="w-4 h-4" /> Alterar Foto da Galeria
                </div>
                <Input 
                  id="avatarFile" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seu Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="pl-10" 
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">URL da Foto (Opcional)</Label>
              <div className="relative">
                <Camera className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="avatarUrl" 
                  value={avatarUrl} 
                  onChange={(e) => {
                    setAvatarUrl(e.target.value);
                    if (!avatarFile) setPreviewUrl(e.target.value);
                  }} 
                  className="pl-10" 
                  placeholder="https://exemplo.com/sua-foto.jpg"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full shadow-lg shadow-primary/20" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
