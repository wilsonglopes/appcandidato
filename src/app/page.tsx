import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-in">
            <ShieldCheck className="w-4 h-4" />
            REDE EXCLUSIVA & SEGURA
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-heading font-black tracking-tight text-foreground mb-6 leading-[1.1]">
            Conectando quem <br />
            <span className="text-primary bg-clip-text">acredita na mudança.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed">
            Bem-vindo ao {process.env.NEXT_PUBLIC_APP_NAME || "Zé Milton"}. Uma plataforma privada para apoiadores, 
            equipe e voluntários.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Acessar a Rede
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl border-2 hover:bg-accent transition-all">
                Tenho um Convite
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-20 bg-card/30 backdrop-blur-sm border-t border-b">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="Informação em Tempo Real"
              description="Receba atualizações exclusivas direto da equipe de campanha sem filtros de redes sociais públicas."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Comunidade Ativa"
              description="Conecte-se com outros voluntários e organize ações de apoio de forma coordenada."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-primary" />}
              title="Privacidade Total"
              description="Seus dados e interações permanecem em um ambiente seguro e restrito a convidados."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground text-sm border-t mt-auto">
        <p>© 2024 Campanha Oficial. Todos os direitos reservados.</p>
        <p className="mt-2 text-xs opacity-50">Desenvolvido com tecnologia de ponta para sua segurança.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4 p-6 rounded-3xl hover:bg-card transition-colors duration-300">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-heading font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
