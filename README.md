# Instru Shop

Boutique d’InstructeurMc sur Peurle SMP. Site statique adapté au téléphone, prévu pour GitHub Pages. Les échanges se déroulent en jeu et les joueurs prennent contact sur Discord.

## État actuel

Le catalogue contient les 11 articles du vendeur. Le contact Discord est **therescaper**. Les prix sont laissés libres : les articles affichent « Prix sur demande » jusqu’à leur saisie. Aucun message n’est envoyé automatiquement et aucune commande n’est enregistrée sur un serveur.

## Modifier le catalogue

Ouvrir **Gérer les prix** dans le pied de page. Saisir la monnaie, les prix et les quantités correspondantes (`pièce`, `lot de 64`, etc.). Un champ vide laisse le prix sur demande. Cliquer sur **Copier mes modifications**, puis **Ouvrir l’éditeur GitHub**. Remplacer tout le contenu de `catalogue.js` par le texte copié, puis cliquer sur **Commit changes** et confirmer. GitHub Pages actualise ensuite le site public. Les changements du formulaire ne sont pas enregistrés avant cette publication.

Seuls le propriétaire du dépôt et ses collaborateurs autorisés peuvent publier. La page de gestion est un outil de préparation public ; elle ne contourne pas les droits GitHub. Aucun mot de passe ni jeton n’est enregistré dans le site.

Quand une commande contient un article sans prix, aucun faux total n’est affiché : le message demande de confirmer le tarif sur Discord. Tous les prix numériques utilisent la monnaie configurée par le vendeur.

## Publication sur GitHub Pages

1. Créer un dépôt pour ce site sur votre compte GitHub.
2. Ajouter à la racine : `index.html`, `style.css`, `app.js`, `catalogue.js`, `images.js`, `gestion.html`, `gestion.js`, `.nojekyll` et ce fichier `README.md`. Les icônes sont intégrées dans `images.js` ; le dossier de travail `assets` n’est pas nécessaire en ligne.
3. Dans **Settings → Pages**, choisir **Deploy from a branch**, la branche **main** et **/(root)**, puis enregistrer.
4. Utiliser l’adresse affichée par GitHub une fois le déploiement terminé.

Le fichier `.nojekyll` permet de servir ces fichiers directement. Aucun outil de compilation ni clé secrète n’est nécessaire. Avec un compte GitHub Free, le dépôt doit être public.

## Images

Les icônes d’objets proviennent des textures de Minecraft Java 26.3. Minecraft et ses ressources graphiques appartiennent à Mojang/Microsoft. Ce site de joueur n’est pas officiel.
