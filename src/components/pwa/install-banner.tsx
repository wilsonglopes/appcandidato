"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Share } from "lucide-react";

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    // Check if it's already installed (standalone mode)
    const _isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!_isStandalone);

    if (_isStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const _isIOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(_isIOS);

    if (_isIOS) {
      // iOS doesn't support beforeinstallprompt, show custom instructions
      const hasDismissed = localStorage.getItem("pwa-banner-dismissed");
      if (!hasDismissed) {
        setShowBanner(true);
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasDismissed = localStorage.getItem("pwa-banner-dismissed");
      if (!hasDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  if (!showBanner || isStandalone) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
      <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl flex flex-col gap-3 relative overflow-hidden">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-primary-foreground/70 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 pr-6">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/20 p-1">
            <img src="/icon-192x192.png" alt="App Icon" className="w-full h-full rounded-lg object-cover" />
          </div>
          <div>
            <h3 className="font-bold leading-tight">Instalar App Zé Milton</h3>
            <p className="text-sm text-primary-foreground/90">Mais rápido e não ocupa espaço.</p>
          </div>
        </div>

        {isIOS ? (
          <div className="bg-white/10 rounded-xl p-3 text-sm flex items-center gap-2">
            <span>Para instalar, toque em</span>
            <Share className="w-4 h-4 inline" />
            <span>e depois <strong>"Adicionar à Tela de Início"</strong>.</span>
          </div>
        ) : (
          <Button 
            onClick={handleInstallClick}
            variant="secondary" 
            className="w-full font-bold shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Instalar Aplicativo Agora
          </Button>
        )}
      </div>
    </div>
  );
}
