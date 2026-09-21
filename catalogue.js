// Tarifs à renseigner depuis gestion.html, puis à publier sur GitHub.
window.SHOP = {
  name: 'Instru Shop',
  server: 'Peurle SMP',
  owner: 'InstructeurMc',
  description: 'Des outils, de l’équipement et des ressources à échanger entre joueurs.',
  draft: false,
  orderMode: 'discord', // catalogue, ingame ou discord
  discord: 'therescaper',
  products: [
    { id: 'armure', name: 'Armure complète en diamant', category: 'Armures', image: 'diamond_chestplate', images: ['diamond_helmet','diamond_chestplate','diamond_leggings','diamond_boots'], description: 'Casque, plastron, jambières et bottes.', unit: 'ensemble de 4 pièces', prices: { diamants: 16 } },
    { id: 'pioche', name: 'Pioche en diamant', category: 'Outils', image: 'diamond_pickaxe', description: 'Pour tes sessions de minage.', unit: 'pièce', prices: { fer: 32, or: 32 } },
    { id: 'epee', name: 'Épée en diamant', category: 'Armes', image: 'diamond_sword', description: 'Pour partir à l’aventure bien équipé.', unit: 'pièce', prices: { fer: 32, or: 32 } },
    { id: 'pelle', name: 'Pelle en diamant', category: 'Outils', image: 'diamond_shovel', description: 'Pour préparer le terrain de tes projets.', unit: 'pièce', prices: { fer: 32, or: 32 } },
    { id: 'bouclier', name: 'Bouclier enchanté', category: 'Équipement', image: 'shield', description: 'Solidité III (Unbreaking III) + Raccommodage (Mending).', unit: 'pièce', details: 'Solidité III + Raccommodage', prices: { diamants: 5, fer: 64 } },
    { id: 'carotte', name: 'Carottes dorées', category: 'Nourriture', image: 'golden_carrot', description: 'De quoi garder tes réserves bien remplies.', unit: 'lot de 32', prices: { fer: 64, or: 64, diamants: 16 } },
    { id: 'pain', name: 'Pain', category: 'Nourriture', image: 'bread', description: 'Du ravitaillement pour tes expéditions.', unit: 'lot de 64', prices: { fer: 16 } },
    { id: 'perle', name: 'Perles de l’Ender', category: 'Ressources', image: 'ender_pearl', description: 'Pour te téléporter ou préparer tes crafts.', unit: 'lot de 16', prices: { fer: 64, or: 64, diamants: 8 } },
    { id: 'xp', name: 'Fioles d’expérience', category: 'Enchantement', image: 'experience_bottle', description: 'Quelques points d’expérience à portée de main.', unit: 'lot de 32', prices: { fer: 40, or: 40 } },
    { id: 'lapis', name: 'Lapis-lazuli', category: 'Enchantement', image: 'lapis_lazuli', description: 'Pour ta table d’enchantement et tes teintures.', unit: 'lot de 32', prices: { fer: 32, or: 32, diamants: 8 } },
    { id: 'glowstone', name: 'Glowstone', category: 'Construction', image: 'glowstone', description: 'Des blocs de pierre lumineuse pour tes builds.', unit: 'lot de 32 blocs', prices: { fer: 32, or: 32 } }
  ]
};
