'use strict';
window.Pricing = {
  options(product) {
    return Object.entries(product.prices || {}).filter(([, amount]) => Number.isFinite(amount) && amount >= 0);
  },
  format(currency, amount) {
    const n = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(amount);
    if (currency === 'diamants') return `${n} diamant${amount === 1 ? '' : 's'}`;
    if (currency === 'fer' || currency === 'or') return `${n} lingot${amount === 1 ? '' : 's'} ${currency === 'or' ? 'd’or' : 'de fer'}`;
    return `${n} ${currency}`;
  },
  display(product) {
    const options = this.options(product);
    if (!options.length) return 'Prix sur demande';
    const prices = Object.fromEntries(options);
    const parts = [];
    if (Number.isFinite(prices.fer) && prices.fer === prices.or) {
      const n = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(prices.fer);
      parts.push(`${n} lingot${prices.fer === 1 ? '' : 's'} fer/or`);
    } else {
      for (const currency of ['fer', 'or']) {
        if (Number.isFinite(prices[currency])) parts.push(this.format(currency, prices[currency]));
      }
    }
    if (Number.isFinite(prices.diamants)) parts.push(this.format('diamants', prices.diamants));
    for (const [currency, amount] of options) {
      if (!['fer', 'or', 'diamants'].includes(currency)) parts.push(this.format(currency, amount));
    }
    return parts.join(' ou ');
  },
  quote(product, count, currency) {
    const option = this.options(product).find(([key]) => key === currency);
    return option ? this.format(currency, option[1] * count) : 'prix sur demande';
  },
  total(products, selection, payments) {
    const totals = new Map();
    let unknown = false;
    for (const product of products) {
      const quantity = selection.get(product.id);
      if (!quantity) continue;
      const currency = payments.get(product.id);
      const option = this.options(product).find(([key]) => key === currency);
      if (!option) { unknown = true; continue; }
      totals.set(currency, (totals.get(currency) || 0) + option[1] * quantity);
    }
    const sum = [...totals].map(([currency, amount]) => this.format(currency, amount)).join(' + ');
    return sum ? `Total : ${sum}${unknown ? ' + articles au prix à confirmer' : ''}` : 'Prix à confirmer sur Discord';
  }
};
