const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  try {
    // Buscar Admin
    const adminRes = await client.query("SELECT id FROM \"User\" WHERE role = 'ADMIN' LIMIT 1");
    if (adminRes.rows.length === 0) {
      console.log("Nenhum administrador encontrado.");
      return;
    }
    const adminId = adminRes.rows[0].id;

    const posts = [
      "Bom dia, amigos! Hoje começamos nossa caminhada rumo a uma cidade melhor. 🇧🇷",
      "Acabei de visitar a feira municipal. Ouvir as pessoas é o primeiro passo para governar bem.",
      "Nossa proposta para a saúde é clara: mais médicos nos postos e exames mais rápidos.",
      "Obrigado pelo carinho de todos no bairro Santa Rosa hoje à tarde!",
      "Estamos ao vivo agora discutindo segurança pública. Clique no link para assistir!",
      "A educação é a base de tudo. Vamos investir pesado na reforma das nossas escolas.",
      "Mais uma reunião produtiva com as lideranças comunitárias. Juntos somos mais fortes.",
      "O apoio de vocês nas redes sociais é fundamental. Continuem compartilhando nossas ideias!",
      "Hoje o dia foi longo, mas valeu a pena cada aperto de mão e cada conversa.",
      "Amanhã teremos uma grande carreata. Espero todos vocês lá às 09h!",
      "Transparência é meu compromisso. Todos os nossos gastos de campanha estão no site.",
      "Vamos revitalizar nossos parques e praças. Lazer é qualidade de vida.",
      "Conversando com os jovens hoje sobre o primeiro emprego. Temos planos para vocês!",
      "Não acreditem em fake news. Nossa campanha é feita de verdades e propostas reais.",
      "Recebi hoje o apoio de mais dois sindicatos. Nossa base só cresce!",
      "Foto da nossa visita à zona rural. O campo também é prioridade no nosso governo.",
      "Faltam poucos dias para a eleição. Vamos manter a energia lá em cima!",
      "Cada voto conta. Vamos conversar com nossos vizinhos e explicar nosso projeto.",
      "Minha família é minha base. Obrigado pelo apoio de sempre!",
      "Reta final! Amanhã é o grande dia. Vamos juntos rumo à vitória! 🚀"
    ];

    console.log(`Iniciando simulação de 20 posts para o Admin ID: ${adminId}`);

    for (let i = 0; i < posts.length; i++) {
      const content = posts[i];
      const id = `simulated-post-${Date.now()}-${i}`;
      await client.query(
        "INSERT INTO \"Post\" (id, content, \"authorId\", \"createdAt\", \"updatedAt\") VALUES ($1, $2, $3, NOW(), NOW())",
        [id, content, adminId]
      );
    }

    console.log("20 postagens simuladas com sucesso direto no banco!");
  } catch (err) {
    console.error("Erro ao simular posts:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
