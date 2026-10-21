# Bandes — journal des versions

Numérotation : `MAJEUR.MINEUR.CORRECTIF`. Le MINEUR suit le numéro de livraison (zip `vN`).
À chaque livraison, mettre la même version dans : `sw.js` (APP_VERSION), `version.json`, et la balise
`<meta name="app-version">` de `index.html` et `editeur.html`. Le changement de `sw.js` déclenche
la bannière « Nouvelle version disponible » chez les utilisateurs déjà installés.

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
