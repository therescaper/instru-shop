export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = origin.startsWith('https://therescaper.github.io') ? origin : 'https://therescaper.github.io';
    const headers = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Méthode non autorisée.' }), { status: 405, headers });
    if (!env.DISCORD_WEBHOOK_URL) return new Response(JSON.stringify({ error: 'Webhook Discord manquant côté Worker.' }), { status: 500, headers });

    let payload;
    try { payload = await request.json(); }
    catch { return new Response(JSON.stringify({ error: 'Commande invalide.' }), { status: 400, headers }); }

    const message = String(payload.message || '').slice(0, 1800);
    const total = String(payload.total || 'Total non précisé').slice(0, 300);
    const delivery = String(payload.delivery || 'Coordonnées non précisées').slice(0, 120);
    const paymentChest = String(payload.paymentChest || 'Coffre non précisé').slice(0, 120);

    if (!message || !Array.isArray(payload.items) || payload.items.length === 0) {
      return new Response(JSON.stringify({ error: 'Commande vide.' }), { status: 400, headers });
    }

    const discordPayload = {
      username: 'Instru Shop',
      content: '🛒 Nouvelle commande Instru Shop',
      embeds: [{
        title: 'Nouvelle commande',
        color: 0xB6EF75,
        description: message,
        fields: [
          { name: 'Total', value: total || 'À confirmer', inline: false },
          { name: 'Livraison', value: delivery, inline: true },
          { name: 'Coffre de paiement', value: paymentChest, inline: true },
        ],
        timestamp: new Date().toISOString(),
      }],
    };

    const response = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) return new Response(JSON.stringify({ error: 'Discord a refusé la commande.' }), { status: 502, headers });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  },
};
