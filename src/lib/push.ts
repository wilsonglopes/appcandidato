import webpush from 'web-push';
import { prisma } from './prisma';

// Configuração do Web Push
if (process.env.VAPID_SUBJECT && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn("VAPID details not fully set in environment variables. Push notifications will not work.");
}

export async function sendNotificationToAll(title: string, body: string, url: string = '/dashboard') {
  // Salvar no histórico global (userId nulo)
  await prisma.notification.create({
    data: { title, body, url }
  });

  const subscriptions = await prisma.pushSubscription.findMany();
  // ... resto do código

  const notifications = subscriptions.map(sub => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        auth: sub.auth,
        p256dh: sub.p256dh
      }
    };

    return webpush.sendNotification(
      pushSubscription,
      JSON.stringify({ title, body, url })
    ).catch(async (err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        // Inscrição expirada ou inválida, remover do banco
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
      }
      console.error('Erro ao enviar push:', err);
    });
  });

  await Promise.all(notifications);
}
