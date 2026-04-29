import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function EventsPage() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">Agenda da Campanha</h2>
        {isAdmin && (
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Novo Evento
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <Card className="border-none bg-muted/30 p-10 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground text-sm">Nenhum evento agendado no momento.</p>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="flex">
                <div className="w-2 bg-primary" />
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <Badge variant={new Date(event.date) > new Date() ? "default" : "secondary"}>
                      {new Date(event.date) > new Date() ? "Confirmado" : "Realizado"}
                    </Badge>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
