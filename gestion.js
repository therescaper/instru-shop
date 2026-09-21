'use strict';
const original = window.SHOP;
const currencies = {fer: 'Lingots de fer', or: 'Lingots d’or', diamants: 'Diamants'};
const fields = new Map();
for (const product of original.products) {
  const row = document.createElement('fieldset');
  const legend = document.createElement('legend'); legend.textContent = product.name;
  row.append(legend);
  const prices = {};
  for (const [currency, name] of Object.entries(currencies)) {
    const priceLabel = document.createElement('label'); priceLabel.textContent = name;
    const price = document.createElement('input');
    price.type = 'number'; price.min = '0'; price.max = '1000000000'; price.step = '1';
    price.inputMode = 'numeric'; price.placeholder = 'Non accepté'; price.value = product.prices?.[currency] ?? '';
    priceLabel.append(price); row.append(priceLabel); prices[currency] = price;
  }
  const unitLabel = document.createElement('label'); unitLabel.textContent = 'Quantité vendue à ce prix';
  const unit = document.createElement('input'); unit.type = 'text'; unit.maxLength = 60; unit.required = true; unit.value = product.unit;
  unitLabel.append(unit); unitLabel.className = 'unit-label'; row.append(unitLabel);
  fields.set(product.id, {prices, unit}); document.getElementById('price-editor').append(row);
}
document.getElementById('prices-form').addEventListener('submit', async event => {
  event.preventDefault();
  const updated = {...original, products: original.products.map(p => {
    const {prices, unit} = fields.get(p.id);
    const keys = [...new Set([...Object.keys(p.prices || {}), ...Object.keys(currencies)])];
    return {...p, prices: Object.fromEntries(keys.filter(key => prices[key] && prices[key].value !== '').map(key => [key, Number(prices[key].value)])), unit: unit.value.trim() || p.unit};
  })};
  const text = '// Catalogue Instru Shop — modifier les prix depuis gestion.html\nwindow.SHOP = ' + JSON.stringify(updated, null, 2) + ';\n';
  document.getElementById('export-content').value = text;
  document.getElementById('export-label').hidden = false;
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById('editor-status').textContent = 'Modifications copiées. Ouvre maintenant l’éditeur GitHub pour les publier.';
  } catch {
    document.getElementById('export-content').focus(); document.getElementById('export-content').select();
    document.getElementById('editor-status').textContent = 'Copie le texte ci-dessous, puis colle-le dans l’éditeur GitHub.';
  }
});
document.getElementById('prices-form').addEventListener('input', () => {
  document.getElementById('export-label').hidden = true;
  document.getElementById('editor-status').textContent = 'Modifications non publiées : copie à nouveau le catalogue une fois terminé.';
});
