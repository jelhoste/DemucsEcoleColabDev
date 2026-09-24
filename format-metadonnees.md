# Format des fichiers « Bandes »

Chaque morceau traité produit **deux fichiers séparés** (regroupés dans un zip si
plusieurs morceaux sont traités en une fois) :

- `<nom>_stems.flac` — l'audio, 8 canaux (4 stems stéréo fusionnés)
- `<nom>_metadonnees.json` — toutes les métadonnées, en clair

Ce document décrit le format du fichier `.json`, destiné à être lu et écrit par le
portail (formulaire prof/élève) et par l'éditeur web de Bandes.

## Pourquoi deux fichiers séparés plutôt qu'un seul

Une version précédente embarquait les métadonnées directement dans le fichier audio
(tags Vorbis Comment). Ça fonctionnait mais compliquait l'édition (il fallait
réécrire le conteneur audio à chaque modification) et le format audio choisi (Ogg
Vorbis) n'est pas nativement lisible sur iOS. Séparer les deux : l'édition des
métadonnées devient une simple lecture/écriture JSON, et l'audio n'est plus jamais
touché après sa génération.

## Format audio

- **Codec** : FLAC (lossless, compressé)
- **Canaux** : 8 = 4 paires stéréo fusionnées (`amerge` ffmpeg)
- **Compatibilité native** : iOS (Safari 11+/AVFoundation), Android (natif depuis
  Android 5.0, testé jusqu'à 8 canaux), Windows 10+, Linux (universel)
- **Point d'attention** : la norme FLAC associe la configuration 8 canaux au layout
  7.1 (surround). Nos 4 stems sont indépendants, pas du surround — sans incidence si
  le fichier est lu par un script (ffmpeg, `soundfile`, etc.), mais un lecteur grand
  public pourrait mal l'interpréter s'il tente un rendu spatial automatique.

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
