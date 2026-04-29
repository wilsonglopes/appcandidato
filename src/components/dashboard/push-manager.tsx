"use client";

import { useEffect, useState } from "react";
import { registerPushAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
    if (Notification.permission === 'denied') {
      setIsPermissionDenied(true);
    }
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      });

      // Enviar para o servidor
      const subData = JSON.parse(JSON.stringify(sub));
      await registerPushAction(subData);
      
      setSubscription(sub);
      toast.success("Notificações ativadas com sucesso!");
    } catch (error) {
      console.error("Erro ao assinar push:", error);
      toast.error("Falha ao ativar notificações.");
    }
  }

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10 mb-6">
      <div className="bg-primary/10 p-2 rounded-full">
        {subscription ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-muted-foreground" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">Notificações da Campanha</p>
        <p className="text-[10px] text-muted-foreground">
          {subscription ? "Você está inscrito para receber alertas." : "Ative para receber avisos de carreatas e lives."}
        </p>
      </div>
      {!subscription && !isPermissionDenied && (
        <Button size="sm" onClick={subscribeToPush} className="h-8 text-xs">Ativar</Button>
      )}
      {subscription && (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
