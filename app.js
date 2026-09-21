'use strict';
const shop = window.SHOP;
const selection = new Map();
const numbers = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });
const hasPrice = product => Number.isFinite(product.price) && product.price >= 0 && Boolean(shop.currency.trim());
const money = value => `${numbers.format(value)} ${shop.currency}`;
const byId = id => document.getElementById(id);
const write = (id, text) => { byId(id).textContent = text; };
document.title = `${shop.name} — Boutique Minecraft`;
write('shop-name', shop.name);
write('footer-brand', `${shop.name} · Commerce entre joueurs`);
write('shop-description', shop.description);
if (shop.server) write('server-name', shop.server);
byId('draft-note').hidden = !shop.draft;
const canOrder = !shop.draft && (shop.orderMode === 'ingame' ? Boolean(shop.owner) : shop.orderMode === 'discord' && Boolean(shop.discord));
byId('order-panel').hidden = !canOrder;
write('article-count', `${shop.products.length} article${shop.products.length > 1 ? 's' : ''}`);
if (!shop.draft) {
  write('contact-summary', shop.orderMode === 'discord' && shop.discord ? `Discord : ${shop.discord}` : shop.owner ? `En jeu : ${shop.owner}` : 'Catalogue des échanges');
}
function element(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content !== undefined) el.textContent = content;
  return el;
}
for (const product of shop.products) {
  const card = element('article', 'product-card');
  const display = element('div', 'product-image');
  if (product.images) display.classList.add('armor-images');
  for (const asset of product.images || [product.image]) {
    const image = new Image(80, 80);
    image.src = window.ITEM_ICONS[asset];
    image.alt = '';
    display.append(image);
  }
  const content = element('div', 'product-content');
  content.append(element('p', 'category', product.category), element('h3', '', product.name), element('p', 'product-description', product.description));
  const cost = element('div', 'product-cost');
  cost.append(element('strong', '', hasPrice(product) ? money(product.price) : 'Prix sur demande'), element('span', '', `/ ${product.unit}`));
  content.append(cost);
  if (canOrder) {
    const button = element('button', 'add-button', 'Ajouter à ma commande');
    button.type = 'button';
    button.setAttribute('aria-label', `Ajouter ${product.name} à ma commande`);
    button.addEventListener('click', () => {
      selection.set(product.id, Math.min(64, (selection.get(product.id) || 0) + 1));
      updateOrder();
      write('copy-status', `${product.name} ajouté.`);
    });
    content.append(button);
  }
  card.append(display, content);
  byId('products').append(card);
}
if (!shop.products.length) byId('products').append(element('p', '', 'Le catalogue arrive bientôt.'));
function selected() { return shop.products.filter(p => selection.has(p.id)); }
function totalText() {
  if (selected().some(p => !hasPrice(p))) return 'Prix à confirmer sur Discord';
  return `Total : ${money(selected().reduce((sum, p) => sum + p.price * selection.get(p.id), 0))}`;
}
function updateOrder() {
  byId('order-items').replaceChildren();
  byId('order-fallback').hidden = true;
  for (const product of selected()) {
    const row = element('li', 'order-row');
    row.append(element('span', '', `${selection.get(product.id)} × ${product.name} (${product.unit})`));
    const remove = element('button', 'remove-button', 'Retirer');
    remove.type = 'button';
    remove.setAttribute('aria-label', `Retirer un lot de ${product.name}`);
    remove.addEventListener('click', () => {
      const amount = selection.get(product.id) - 1;
      if (amount) selection.set(product.id, amount); else selection.delete(product.id);
      write('copy-status', ''); updateOrder();
    });
    row.append(remove); byId('order-items').append(row);
  }
  byId('order-empty').hidden = selection.size > 0;
  byId('copy-order').disabled = selection.size === 0;
  write('order-total', selection.size ? totalText() : '');
  write('order-help', shop.orderMode === 'discord' ? `Envoie ensuite ce message à ${shop.discord} sur Discord pour convenir de l’échange.` : `Envoie ensuite ce message à ${shop.owner} en jeu pour convenir de l’échange.`);
}
byId('copy-order').addEventListener('click', async () => {
  if (!selection.size) return;
  const message = `Bonjour ! Je voudrais commander chez ${shop.name} sur ${shop.server} : ${selected().map(p => `${selection.get(p.id)} × ${p.name} (${p.unit})`).join(', ')}. ${totalText()}. Quand peut-on se retrouver en jeu ?`;
  try {
    await navigator.clipboard.writeText(message);
    write('copy-status', 'Message copié ! Il te reste à l’envoyer au vendeur.');
  } catch {
    byId('order-fallback').value = message;
    byId('order-fallback').hidden = false;
    byId('order-fallback').focus(); byId('order-fallback').select();
    write('copy-status', 'Copie le message ci-dessous, puis envoie-le au vendeur.');
  }
});
updateOrder();
byId('copy-discord').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(shop.discord);
    write('discord-status', 'Pseudo copié ! Ajoute therescaper sur Discord.');
  } catch { write('discord-status', `Pseudo Discord : ${shop.discord}`); }
});
