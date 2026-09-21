// Tarifs à renseigner depuis gestion.html, puis à publier sur GitHub.
window.SHOP = {
  name: 'Instru Shop',
  server: 'Peurle SMP',
  owner: 'InstructeurMc',
  description: 'Des outils, de l’équipement et des ressources à échanger entre joueurs.',
  currency: '',
  draft: false,
  orderMode: 'discord', // catalogue, ingame ou discord
  discord: 'therescaper',
  products: [
    { id: 'armure', name: 'Armure complète en diamant', category: 'Armures', image: 'diamond_chestplate', images: ['diamond_helmet','diamond_chestplate','diamond_leggings','diamond_boots'], description: 'Casque, plastron, jambières et bottes.', unit: 'ensemble de 4 pièces', price: null },
    { id: 'pioche', name: 'Pioche en diamant', category: 'Outils', image: 'diamond_pickaxe', description: 'Pour tes sessions de minage.', unit: 'pièce', price: null },
    { id: 'epee', name: 'Épée en diamant', category: 'Armes', image: 'diamond_sword', description: 'Pour partir à l’aventure bien équipé.', unit: 'pièce', price: null },
    { id: 'pelle', name: 'Pelle en diamant', category: 'Outils', image: 'diamond_shovel', description: 'Pour préparer le terrain de tes projets.', unit: 'pièce', price: null },
    { id: 'bouclier', name: 'Bouclier', category: 'Équipement', image: 'shield', description: 'Un indispensable face aux attaques.', unit: 'pièce', price: null },
    { id: 'carotte', name: 'Carotte dorée', category: 'Nourriture', image: 'golden_carrot', description: 'De quoi garder tes réserves bien remplies.', unit: 'pièce', price: null },
    { id: 'pain', name: 'Pain', category: 'Nourriture', image: 'bread', description: 'Du ravitaillement pour tes expéditions.', unit: 'pièce', price: null },
    { id: 'perle', name: 'Perle de l’Ender', category: 'Ressources', image: 'ender_pearl', description: 'Pour te téléporter ou préparer tes crafts.', unit: 'pièce', price: null },
    { id: 'xp', name: 'Fiole d’expérience', category: 'Enchantement', image: 'experience_bottle', description: 'Quelques points d’expérience à portée de main.', unit: 'pièce', price: null },
    { id: 'lapis', name: 'Lapis-lazuli', category: 'Enchantement', image: 'lapis_lazuli', description: 'Pour ta table d’enchantement et tes teintures.', unit: 'pièce', price: null },
    { id: 'glowstone', name: 'Glowstone', category: 'Construction', image: 'glowstone', description: 'Un bloc de pierre lumineuse pour tes builds.', unit: 'bloc', price: null }
  ]
};
