# Bandes — journal des versions

Numérotation : `MAJEUR.MINEUR.CORRECTIF`. Le MINEUR suit le numéro de livraison (zip `vN`).
À chaque livraison, mettre la même version dans : `sw.js` (APP_VERSION), `version.json`, et la balise
`<meta name="app-version">` de `index.html` et `editeur.html`. Le changement de `sw.js` déclenche
la bannière « Nouvelle version disponible » chez les utilisateurs déjà installés.

## 1.20.0 — 2026-10-22
- Correctif banc d'essai : quand le fichier voix et la table des temps (.json/.zip) étaient envoyés ensemble dans Colab, le notebook prenait le .json pour l'audio (erreur « Error opening ..._metadonnees.json »). Le fichier voix est maintenant le fichier audio parmi ceux envoyés, et la table des temps envoyée en même temps est reconnue (plus de seconde demande).
- Comparateur : mode « Carrousel » (un relevé à la fois, flèches ← →, liste déroulante, option « seul le relevé affiché sonne » pour comparer à l'oreille en changeant de relevé pendant la lecture) en plus de l'affichage en liste.
- Comparateur : note de 0 à 20 par relevé, « Trier par note », export « Notes (CSV) » (nom, note, détecteur, réglages), réglages lus depuis le reglages.json du zip du banc d'essai et affichés en info-bulle ; avertissement avant de quitter la page si des notes sont saisies.

## 1.19.1 — 2026-10-22
- Banc d'essai : bloc « Et ensuite ? » (lien Google Colab, étapes) et pied de page comme dans « Préparer ».
- Notebook du banc d'essai : récapitulatif au lancement (détecteurs, source du fichier voix, table des temps) pour vérifier les présélections.

## 1.19.0 — 2026-10-22
- Banc d'essai : bouton « ⇩ Notebook … seul » en haut à droite de chaque conteneur (FCPE, RMVPE, Basic Pitch) pour ne générer le notebook que pour ce modèle.
- Banc d'essai : table des temps facultative (le …_metadonnees.json du morceau ou son zip, envoyé dans Colab ou sur Drive). Calage des notes sur la grille des temps (subdivisions 0/1/2/3/4, attraction réglable), chaque calage donnant une variante en plus ; structure.json ajouté au zip exporté. Explications sur les fichiers à fournir (beats, downbeats, beat_positions, bpm, segments).
- Comparateur : charge la table des temps (.json ou structure.json du zip) : grille des temps, temps forts, sections sur la règle, bouton ▦ Grille et clic de métronome ♩ Clic (accent sur le temps fort).

## 1.18.0 — 2026-10-21
- Nouvelle page « Banc d'essai mélodie » (banc.html) : génère un notebook Colab qui prend un seul fichier voix et teste toutes les combinaisons de réglages de FCPE, RMVPE et Basic Pitch (listes de valeurs séparées par des virgules). Un fichier MIDI par variante (1 ms par tick, temps exacts), doublons écartés, export en zip avec reglages.json.
- Nouvelle page « Comparer des relevés » (comparateur.html) : charge un audio et des MIDI (ou le zip du banc d'essai), forme d'onde au-dessus et un relevé par piste ; synthé par relevé (timbre, octave, volume), panoramique G/C/D, muet, solo, zone de boucle (glisser sur la règle, ou boutons A/B), zoom, hauteurs réglables.
- Onglets de navigation ajoutés dans les quatre pages.

## 1.17.0 — 2026-10-21
- Générateur : la mélodie se choisit par cases à cocher (FCPE, RMVPE, Basic Pitch, SwiftF0, CREPE, Melodia, pYIN), autant que voulu ; ★ sur FCPE, RMVPE et Basic Pitch. Le premier détecteur réussi (dans l'ordre de la liste) devient la version active ; comparaison dans l'éditeur dès 2 résultats.
- Notebook : bloc de réglages Basic Pitch en haut, commentés (seuils d'attaque et de note, durée minimale, tessiture, melodia trick, fusion des trous, correction des octaves isolées). Repli automatique si la version installée n'accepte pas tous les réglages.

## 1.16.0 — 2026-10-21
- Éditeur : bouton « ↕ Hauteurs » : réglage de la hauteur de la forme d'onde, du piano roll de la mélodie (jusqu'à 700 px) et des cartes ; mémorisé.
- Éditeur : bouton « ♫ + Mélodie » : le piano roll s'affiche en même temps que la piste choisie (Structure, Accords, Paroles, Marqueurs). Touches blanches nommées quand le piano roll est assez haut.
- Éditeur : synthétiseur de contrôle de la mélodie (♪ Synthé mélodie) : joue les notes en synchronisation avec la lecture, timbre (triangle, sinus, dent de scie, carré), octave −1/0/+1, volume. Aperçu sonore d'une note quand on la déplace en hauteur ; suit les modifications pendant la lecture.

## 1.15.0 — 2026-10-21
- Éditeur, piste Paroles seule : la piste ne montre plus que les phrases (cartes entières, agrandies comme les accords). Sous la forme d'onde, un panneau « phrase » occupe toute la largeur : la phrase survolée, sinon la phrase épinglée (clic sur une carte), sinon celle de la lecture. Il montre cette seule phrase étirée sur toute la largeur, avec forme d'onde et temps de la grille, les mots, leurs ancres à gauche, l'édition du texte (du mot par un clic, de la phrase dans l'en-tête sans perdre le minutage), phrase précédente / suivante, « Suivre la lecture ».
- Les boutons ＋ / ✂ / 🗑 agissent sur les mots de ce panneau.

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
