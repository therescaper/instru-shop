'use strict';
const original = window.SHOP;
const currencyInput = document.getElementById('currency');
currencyInput.value = original.currency;
const fields = new Map();
for (const product of original.products) {
  const row = document.createElement('fieldset');
  const legend = document.createElement('legend'); legend.textContent = product.name;
  const priceLabel = document.createElement('label'); priceLabel.textContent = 'Prix';
  const price = document.createElement('input');
  price.type = 'number'; price.min = '0'; price.max = '1000000000'; price.step = '0.01';
  price.inputMode = 'decimal'; price.placeholder = 'Sur demande'; price.value = product.price ?? '';
  priceLabel.append(price);
  const unitLabel = document.createElement('label'); unitLabel.textContent = 'Quantité vendue à ce prix';
  const unit = document.createElement('input'); unit.type = 'text'; unit.maxLength = 60; unit.required = true; unit.value = product.unit;
  unitLabel.append(unit); row.append(legend, priceLabel, unitLabel);
  fields.set(product.id, {price, unit}); document.getElementById('price-editor').append(row);
}
document.getElementById('prices-form').addEventListener('submit', async event => {
  event.preventDefault();
  const currency = currencyInput.value.trim();
  currencyInput.setCustomValidity('');
  if (!currency && [...fields.values()].some(({price}) => price.value !== '')) {
    currencyInput.setCustomValidity('Précise la monnaie utilisée pour les prix.'); currencyInput.reportValidity(); return;
  }
  const updated = {...original, currency, products: original.products.map(p => {
    const {price, unit} = fields.get(p.id);
    return {...p, price: price.value === '' ? null : Number(price.value), unit: unit.value.trim() || p.unit};
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
currencyInput.addEventListener('input', () => currencyInput.setCustomValidity(''));
document.getElementById('prices-form').addEventListener('input', () => {
  document.getElementById('export-label').hidden = true;
  document.getElementById('editor-status').textContent = 'Modifications non publiées : copie à nouveau le catalogue une fois terminé.';
});
