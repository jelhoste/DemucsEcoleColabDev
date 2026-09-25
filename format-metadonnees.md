# Format des fichiers « Bandes »

Chaque morceau traité produit une **archive `.zip` unique** contenant :

- `<nom>_stems.opus` — l'audio, 8 canaux (4 stems stéréo fusionnés)
- `<nom>_metadonnees.json` — toutes les métadonnées, en clair

Ce document décrit le format du fichier `.json`, destiné à être lu et écrit par le
portail (formulaire prof/élève) et par l'éditeur web de Bandes.

## Pourquoi un zip avec deux fichiers séparés plutôt qu'un seul fichier audio

Une version précédente embarquait les métadonnées directement dans le fichier audio
(tags Vorbis Comment). Ça fonctionnait mais compliquait l'édition (il fallait
réécrire le conteneur audio à chaque modification). Séparer les deux : l'édition des
métadonnées devient une simple lecture/écriture JSON, et l'audio n'est plus jamais
touché après sa génération. Le zip permet de continuer à ne fournir qu'un seul
fichier à l'éditeur (qui sait le lire et en réécrire un à jour).

## Format audio

- **Codec** : Opus (lossy, `mapping_family 255` — canaux traités comme indépendants,
  sans sémantique surround)
- **Canaux** : 8 = 4 paires stéréo fusionnées (`amerge` ffmpeg)
- **Compatibilité** : décodage natif dans tous les navigateurs modernes (Chrome,
  Firefox, Edge, Safari 18.4+ y compris sur iOS) — donc dans l'éditeur web de Bandes,
  sur toutes les plateformes. Point d'attention : en dehors du navigateur, iOS
  n'ouvre pas nativement un fichier Opus/Ogg dans l'app Fichiers/Musique (il faudrait
  un conteneur `.caf` propriétaire, incompatible avec les autres plateformes) — sans
  impact tant que la consultation se fait via l'éditeur Bandes.

## Format JSON

```json
{
  "pistes": ["vocals", "drums", "bass", "other"],

  "structure": {
    "bpm": 118.4,
    "beats": [0.33, 0.75, 1.14, 1.55],
    "beat_positions": [1, 2, 3, 4],
    "downbeats": [0.33, 1.94, 3.53],
    "segments": [
      { "start": 0.0,   "end": 0.33,  "label": "start" },
      { "start": 0.33,  "end": 13.13, "label": "intro" }
    ]
  },

  "accords": [
    { "start": 0.0,   "end": 1.481, "chord": "N"  },
    { "start": 1.481, "end": 3.981, "chord": "A#" }
  ],

  "melodie": [
    { "start": 12.34, "end": 12.71, "midi": 64 }
  ],

  "paroles": [
    { "start": 0.9, "end": 4.2, "texte": "Voici les premières paroles" }
  ],

  "metadata": {
    "nom_fichier": "dupont_clair_de_lune.wav",
    "eleve": "Camille Dupont",
    "prof": "M. Martin",
    "morceau": "Clair de lune",
    "artiste": "Debussy",
    "tonalite": "Ré bémol majeur",
    "niveau": { "cycle": "2e cycle", "echelle": "5" },
    "commentaire": "Travailler le legato mesures 12-16",
    "date": "2026-09-14"
  },

  "releves": []
}
```

### `pistes`
Ordre des stems dans les canaux du fichier `.flac` associé (canaux 1-2 = premier
élément, 3-4 = second, etc.).

### `structure`
- `beats` / `downbeats` : timestamps en secondes. `downbeats` = premier temps de
  chaque mesure.
- `beat_positions` : position dans la mesure pour chaque `beat` (1 = temps fort)
- `segments` : sections fonctionnelles (`start`, `end`, `label` parmi `start`,
  `intro`, `verse`, `chorus`, `bridge`, `outro`, `end`, etc.)

### `accords`
Timeline d'accords, notation Harte simplifiée (`"A#"` = la# majeur, `"A#:min"` = la#
mineur, `"N"` = silence/pas d'accord).

### `melodie`
Notes de la mélodie chantée (extraction heuristique — pitch + quantification, pas un
modèle de transcription musicale dédié). `midi` = numéro MIDI (60 = do central).

### `paroles`
Segments transcrits automatiquement, horodatés. Peuvent contenir des hallucinations
résiduelles du modèle de reconnaissance vocale (filtrées autant que possible en
amont) — à valider humainement plutôt qu'à considérer comme fiable à 100%.

### `metadata`
Informations générales du morceau. Tous les champs sont des chaînes de texte,
présentes même vides (`""`), y compris `niveau.cycle` et `niveau.echelle`.

### `releves`
Section pédagogique par instrument, **destinée à être remplie par le portail élève**
(pas encore générée automatiquement). Schéma prévu :

```json
[
  {
    "instrument": "batterie",
    "sous_titre": "Intro et couplet 1",
    "auteur": "Camille Dupont",
    "date_releve": "2026-09-20",
    "statut": "en_cours",
    "marqueurs": [
      { "temps": "0:12", "texte": "Fill de caisse claire", "maitrise": "acquis" }
    ]
  }
]
```

## Éditer ces fichiers

L'éditeur web de Bandes (`editeur.html`) charge l'audio (pour la forme d'onde et
l'écoute) et le JSON séparément, permet de corriger structure/accords/mélodie/paroles
sur une timeline zoomable, puis exporte un nouveau `.json` — à remplacer directement
sur le fichier d'origine. Le fichier `.flac` n'est jamais modifié par cet outil.

Le portail peut appliquer la même logique : lire le JSON, modifier les champs
voulus (typiquement `releves`), réécrire le fichier. Aucune bibliothèque spécifique
n'est nécessaire (JSON standard).
