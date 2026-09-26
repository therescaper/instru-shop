'use strict';
const shop = window.SHOP;
const selection = new Map();
const payments = new Map();
const pricing = window.Pricing;
const webhookEndpoint = window.ORDER_WEBHOOK_ENDPOINT || '';
const byId = id => document.getElementById(id);
const write = (id, text) => { byId(id).textContent = text; };
let toastTimer;
function showToast(message) {
  const toast = byId('cart-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.remove('is-visible');
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => { toast.hidden = true; }, 220);
  }, 2200);
}
document.title = `${shop.name} — Boutique Minecraft`;
write('shop-name', shop.name);
write('footer-brand', `${shop.name} · Commerce entre joueurs`);
write('shop-description', shop.description);
if (shop.server) write('server-name', shop.server);
const canOrder = shop.orderMode === 'ingame' ? Boolean(shop.owner) : shop.orderMode === 'discord' && Boolean(shop.discord);
byId('order-panel').hidden = !canOrder;
write('article-count', `${shop.products.length} article${shop.products.length > 1 ? 's' : ''}`);
function setupQuantityInput(input) {
  input.type = 'text';
  input.inputMode = 'numeric';
  input.pattern = '[0-9]*';
  input.autocomplete = 'off';
  input.addEventListener('focus', () => input.select());
  input.addEventListener('click', () => input.select());
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 2);
  });
}
function cleanQuantity(value) {
  return Math.max(1, Math.min(64, Math.floor(Number(value) || 1)));
}
function element(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content !== undefined) el.textContent = content;
  return el;
}
const shelves = [
  {name:'Tout', icon:'emerald'},
  {name:'Blocs', icon:'bookshelf'},
  {name:'Consommables', icon:'golden_carrot'},
  {name:'Équipement', icon:'diamond_pickaxe'},
  {name:'Enchantements', icon:'book'},
  {name:'Ressources', icon:'lapis_lazuli'}
];
function shelfFor(product) {
  if (product.shelf && shelves.some(s => s.name === product.shelf && s.name !== 'Tout')) return product.shelf;
  if (product.id === 'bibliotheques' || ['Construction','Blocs'].includes(product.category)) return 'Blocs';
  if (['xp','perle'].includes(product.id) || ['Nourriture','Potions','Consommables'].includes(product.category)) return 'Consommables';
  if (['Outils','Armes','Armures','Équipement'].includes(product.category)) return 'Équipement';
  return 'Ressources';
}
const productCards = [];
const shelfButtons = [];
function selectShelf(name) {
  let count = 0;
  for (const {card, shelf} of productCards) {
    card.hidden = name !== 'Tout' && shelf !== name;
    if (!card.hidden) count++;
  }
  for (const button of shelfButtons) button.setAttribute('aria-pressed', String(button.dataset.shelf === name));
  write('article-count', `${count} article${count > 1 ? 's' : ''}`);
  write('shelf-status', `${name === 'Tout' ? 'Tous les rayons' : name} · ${count} article${count > 1 ? 's' : ''}`);
}
for (const product of shop.products) {
  const card = element('article', 'product-card');
  const shelf = shelfFor(product);
  productCards.push({card, shelf});
  const display = element('div', 'product-image');
  if (product.images) display.classList.add('armor-images');
  for (const asset of product.images || [product.image]) {
    const image = new Image(80, 80);
    image.src = window.ITEM_ICONS[asset];
    image.alt = '';
    display.append(image);
  }
  const content = element('div', 'product-content');
  content.append(element('p', 'category', shelf), element('h3', '', product.name), element('p', 'product-description', product.description));
  const cost = element('div', 'product-cost');
  const options = pricing.options(product);
  cost.append(element('strong', '', pricing.display(product)), element('span', '', `/ ${product.unit}`));
  content.append(cost);
  if (canOrder) {
    const quantityLabel = element('label', 'quantity-control', 'Quantité');
    const quantityInput = document.createElement('input');
    setupQuantityInput(quantityInput);
    quantityInput.value = '1';
    quantityInput.setAttribute('aria-label', `Quantité de ${product.name} à ajouter`);
    quantityLabel.append(quantityInput);
    const button = element('button', 'add-button', 'Ajouter à ma commande');
    button.type = 'button';
    button.setAttribute('aria-label', `Ajouter ${product.name} à ma commande`);
    button.addEventListener('click', () => {
      const quantity = cleanQuantity(quantityInput.value);
      quantityInput.value = String(quantity);
      selection.set(product.id, Math.min(64, (selection.get(product.id) || 0) + quantity));
      if (!payments.has(product.id) && options.length) payments.set(product.id, options[0][0]);
      updateOrder();
      write('copy-status', `${quantity} × ${product.name} ajouté${quantity > 1 ? 's' : ''}.`);
      showToast(`${product.name} ajouté${quantity > 1 ? 's' : ''} au panier`);
    });
    content.append(quantityLabel, button);
  }
  card.append(display, content);
  byId('products').append(card);
}
for (const shelf of shelves) {
  const button = element('button', 'shelf-button');
  button.type = 'button'; button.dataset.shelf = shelf.name;
  button.setAttribute('aria-controls', 'products');
  const icon = new Image(24,24); icon.src = window.ITEM_ICONS[shelf.icon]; icon.alt = '';
  const count = shelf.name === 'Tout' ? shop.products.length : productCards.filter(p => p.shelf === shelf.name).length;
  button.append(icon, element('span','',shelf.name),element('span','shelf-count',count));
  button.addEventListener('click', () => selectShelf(shelf.name));
  shelfButtons.push(button); byId('shelf-track').append(button);
}
const shelfTrack = byId('shelf-track');
function updateShelfArrows() {
  byId('shelf-prev').disabled = shelfTrack.scrollLeft <= 1;
  byId('shelf-next').disabled = shelfTrack.scrollLeft + shelfTrack.clientWidth >= shelfTrack.scrollWidth - 1;
}
for (const [id,direction] of [['shelf-prev',-1],['shelf-next',1]]) {
  byId(id).addEventListener('click', () => shelfTrack.scrollBy({left:direction * 220,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));
}
shelfTrack.addEventListener('scroll',updateShelfArrows,{passive:true});
new ResizeObserver(updateShelfArrows).observe(shelfTrack);
selectShelf('Tout'); updateShelfArrows();
if (!shop.products.length) byId('products').append(element('p', '', 'Le catalogue arrive bientôt.'));
function selected() { return shop.products.filter(p => selection.has(p.id)); }
function totalText() { return pricing.total(shop.products, selection, payments); }
function updateOrder() {
  if (canOrder && selection.size > 0) byId('order-panel').hidden = false;
  byId('order-items').replaceChildren();
  byId('order-fallback').hidden = true;
  for (const product of selected()) {
    const row = element('li', 'order-row');
    const summary = element('div', 'order-summary');
    summary.append(element('span', '', `${selection.get(product.id)} × ${product.name} (${product.unit})`));
    const quantityLabel = element('label', 'order-quantity', 'Quantité');
    const quantityInput = document.createElement('input');
    setupQuantityInput(quantityInput);
    quantityInput.value = String(selection.get(product.id));
    quantityInput.setAttribute('aria-label', `Modifier la quantité de ${product.name}`);
    quantityInput.addEventListener('change', () => {
      const quantity = cleanQuantity(quantityInput.value);
      selection.set(product.id, quantity);
      write('copy-status', '');
      updateOrder();
    });
    quantityLabel.append(quantityInput);
    summary.append(quantityLabel);
    if (product.details) summary.append(element('small', '', product.details));
    const options = pricing.options(product);
    if (options.length > 1) {
      const label = element('label', 'payment-choice', 'Paiement pour cet article');
      const select = element('select');
      select.setAttribute('aria-label', `Paiement pour ${product.name}`);
      for (const [currency] of options) {
        const option = element('option', '', pricing.quote(product, selection.get(product.id), currency));
        option.value = currency; select.append(option);
      }
      select.value = payments.get(product.id);
      select.addEventListener('change', () => {
        payments.set(product.id, select.value);
        write('order-total', totalText()); write('copy-status', '');
        byId('order-fallback').hidden = true;
      });
      label.append(select); summary.append(label);
    } else summary.append(element('small', '', pricing.quote(product, selection.get(product.id), payments.get(product.id))));
    row.append(summary);
    const remove = element('button', 'remove-button', 'Retirer');
    remove.type = 'button';
    remove.setAttribute('aria-label', `Retirer un lot de ${product.name}`);
    remove.addEventListener('click', () => {
      const amount = selection.get(product.id) - 1;
      if (amount) selection.set(product.id, amount); else { selection.delete(product.id); payments.delete(product.id); }
      write('copy-status', ''); updateOrder();
    });
    row.append(remove); byId('order-items').append(row);
  }
  byId('order-empty').hidden = selection.size > 0;
  if (byId('send-order')) byId('send-order').disabled = selection.size === 0;
  write('order-total', selection.size ? totalText() : '');
  write('order-help', webhookEndpoint ? 'Renseigne les coordonnées, puis envoie la commande sur Discord.' : (shop.orderMode === 'discord' ? `Envoie ensuite ce message à ${shop.discord} sur Discord pour convenir de l’échange.` : `Envoie ensuite ce message à ${shop.owner} en jeu pour convenir de l’échange.`));
}
function orderLines() {
  return selected().map(p => `- ${selection.get(p.id)} × ${p.name}${p.details ? ' [' + p.details + ']' : ''} (${p.unit}) — ${pricing.quote(p, selection.get(p.id), payments.get(p.id))}`);
}
function fieldText(prefix, id, fallback) {
  const value = byId(id)?.value.trim();
  return `${prefix} : ${value || fallback}`;
}
function orderMessage() {
  return [
    `Bonjour ! Je voudrais commander chez ${shop.name} sur ${shop.server} :`,
    '',
    ...orderLines(),
    '',
    totalText(),
    '',
    fieldText('Pseudo Minecraft', 'customer-name', 'à préciser'),
    fieldText('Lieu de livraison', 'delivery-location', 'à préciser'),
    fieldText('Coffre de paiement', 'payment-chest', 'à préciser'),
    '',
    'Merci !'
  ].join('\n');
}
const sendOrderButton = byId('send-order');
if (sendOrderButton) {
  sendOrderButton.hidden = !webhookEndpoint;
  sendOrderButton.addEventListener('click', async () => {
    if (!selection.size || !webhookEndpoint) return;
    sendOrderButton.disabled = true;
    write('copy-status', 'Envoi de la commande sur Discord…');
    try {
      const response = await fetch(webhookEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: orderMessage(),
          items: selected().map(p => ({ id: p.id, name: p.name, quantity: selection.get(p.id), unit: p.unit, payment: pricing.quote(p, selection.get(p.id), payments.get(p.id)) })),
          total: totalText(),
          customer: fieldText('Pseudo', 'customer-name', 'à préciser'),
          delivery: fieldText('Livraison', 'delivery-location', 'à préciser'),
          paymentChest: fieldText('Coffre', 'payment-chest', 'à préciser'),
        }),
      });
      if (!response.ok) throw new Error('send failed');
      selection.clear();
      payments.clear();
      updateOrder();
      byId('order-panel').hidden = true;
      write('copy-status', 'Commande envoyée sur Discord !');
    } catch {
      write('copy-status', 'Envoi impossible pour le moment. Réessaie dans quelques instants ou contacte le vendeur sur Discord.');
    } finally {
      sendOrderButton.disabled = false;
    }
  });
}
updateOrder();












