# Bandes — journal des versions

Numérotation : `MAJEUR.MINEUR.CORRECTIF`. Le MINEUR suit le numéro de livraison (zip `vN`).
À chaque livraison, mettre la même version dans : `sw.js` (APP_VERSION), `version.json`, et la balise
`<meta name="app-version">` de `index.html` et `editeur.html`. Le changement de `sw.js` déclenche
la bannière « Nouvelle version disponible » chez les utilisateurs déjà installés.

## 1.14.0 — 2026-10-21
- Éditeur, piste Paroles seule : poignée d'ancre à gauche de chaque mot (déplace son début ; un simple clic dessus saute au mot), fin du mot à droite, corps pour déplacer. Le texte s'écrit en entier : les mots se placent sur autant de rangées que nécessaire pour ne jamais se recouvrir. Un clic sur un mot ouvre l'édition du texte.
- Éditeur, pistes Paroles / Accords / Structure seules : boutons « ＋ Carte au curseur », « ✂ Scinder » (à la position de lecture, ou au curseur de texte pendant l'écriture d'un mot) et « 🗑 Supprimer » ; la carte choisie est entourée de blanc.
- Éditeur : curseur « Taille » (texte plus gros, cartes plus hautes) pour ces vues, mémorisé. Les accords s'affichent en notation courte (Am7) sur la piste.

## 1.13.0 — 2026-10-21
- Éditeur : sélecteur « Piste affichée » au-dessus de la forme d'onde (Toutes, Structure, Accords, Mélodie, Paroles, Marqueurs) : la forme d'onde reste toujours visible, une seule piste s'affiche à la fois. Le choix est mémorisé.
- Éditeur : en mode « Paroles (mot à mot) », chaque mot est un bloc sur la piste, avec ses deux ancres. Glisser le corps déplace le mot, glisser un bord change son début ou sa fin (le bord d'un mot collé à son voisin entraîne celui-ci), clic = aller au mot, double-clic = renommer sans toucher au minutage. Les lignes sans minutage s'affichent en pointillés et le minutage est créé au premier geste.

## 1.12.0 — 2026-10-21
- Colab : le modèle d'alignement par défaut redevient « standard » (le grand modèle reste un choix ; en mode Test, la version active est la standard).
- Éditeur : minutage mot à mot modifiable. Bouton « ♪ n » sur chaque ligne de paroles : texte, début et fin de chaque mot, placement du début à la position de lecture, insertion et suppression de mots, création du minutage pour une ligne qui n'en a pas.
- Éditeur : corriger le texte d'une ligne (liste ou piste) ne fait plus perdre le minutage : les mots inchangés ou remplacés gardent leurs temps, les mots ajoutés se répartissent entre leurs voisins.
- Éditeur : petits repères sur la piste Paroles à chaque début de mot.

## 1.11.1 — 2026-10-21
- PWA : le service worker ignore le cache HTTP de GitHub Pages (fichiers gardés 10 min) et prend la main immédiatement ; la bannière « Nouvelle version disponible — Recharger » compare maintenant la page à `version.json` (vérifié au démarrage, toutes les 10 min et au retour sur l'onglet), sans dépendre du cycle du service worker.

## 1.11.0 — 2026-10-21
- Paroles : WhisperX est désormais le seul aligneur (Whisper seul et Montreal Forced Aligner retirés, installation conda supprimée).
- Paroles : choix du modèle d'alignement dans l'interface — « Grand modèle » (défaut, le plus précis, plus lent), « Standard » (plus rapide), ou « Test » qui garde les deux versions à comparer dans l'éditeur.
- Paroles : grands modèles wav2vec2 pour l'anglais (large-960h-lv60-self) et le français (large-xlsr-53) ; repli automatique sur le modèle standard s'ils ne se chargent pas.
- Paroles : les mots que le modèle ne sait pas placer (chiffres, mots hors vocabulaire) ne sont plus perdus : ils sont répartis entre leurs voisins avec une confiance de 0. Ponctuation retirée et chiffres écrits en lettres avant l'alignement ; le texte d'origine est conservé.
- Éditeur : noms « WhisperX standard » / « WhisperX grand modèle » dans la comparaison (les anciens fichiers restent lisibles).

## 1.10.0 — 2026-10-21
- Éditeur : réglage de volume global (0–150 %, double-clic = 100 %).
- Éditeur : marqueurs personnels (types libres « Point » ou « Attaque + durée », couleur, piste dédiée, glisser/redimensionner, calage temps/mesures, import des relevés, export `marqueurs_perso`).
- Colab : FCPE (mélodie) et madmom (accords) par défaut, avec repli automatique (RMVPE/pYIN ; BTC/référence simple).
- Éditeur : bouton Plein écran corrigé.
- PWA : manifest, service worker versionné, icônes, bannière de mise à jour, version affichée en bas de page.

## 1.9.x et antérieur
- 1.9 : export MusicXML/ABC (double croche), multi-portées par détecteur/moteur.
- 1.8 : détecteurs de mélodie (RMVPE, SwiftF0, CREPE, FCPE, pYIN, Melodia, Basic Pitch) + comparaison.
- 1.7 : grille de temps/mesures, calage, volume par piste, plein écran, piano roll.
- 1.6 : moteurs d'accords (BTC, madmom, référence librosa) + comparaison.
- 1.5 : aligneurs de paroles (Whisper, WhisperX, MFA) + comparaison ; Demucs 4 / 6S.
- 1.2–1.4 : export Opus (pistes séparées, 8 canaux), mixeur, cartes jointes/scindées, karaoké.
