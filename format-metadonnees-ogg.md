# Format des métadonnées « Bandes » dans les fichiers .ogg

Ce document décrit comment lire et écrire les métadonnées produites/attendues par le
pipeline « Bandes » (structure, accords, relevés pédagogiques) à l'intérieur d'un
fichier Ogg Vorbis multipiste, pour permettre au portail de générer ou modifier ces
fichiers de façon compatible.

## 1. Format du fichier audio

- **Conteneur** : Ogg Vorbis (`.ogg`)
- **Canaux** : 8 canaux = 4 paires stéréo, une par stem, fusionnées avec `ffmpeg` (filtre `amerge`)
- **Ordre des canaux** (canaux 1-2, 3-4, 5-6, 7-8) :

  | Canaux | Stem |
  |---|---|
  | 1-2 | voix (`vocals`) |
  | 3-4 | batterie (`drums`) |
  | 5-6 | basse (`bass`) |
  | 7-8 | autres instruments (`other`) |

  L'ordre réel est aussi toujours donné explicitement dans le tag `BANDES_PISTES`
  (voir plus bas) — s'y référer plutôt que de supposer l'ordre ci-dessus si un stem
  est absent (dans ce cas les canaux se décalent).

## 2. Les métadonnées : Vorbis Comments

Les métadonnées sont stockées comme des **Vorbis Comments** classiques (paires
clé/valeur texte, standard du format Ogg). Chaque valeur est une chaîne JSON.

Bibliothèque recommandée pour les lire/écrire : **[mutagen](https://mutagen.readthedocs.io/)** (Python).

### Lecture

```python
from mutagen.oggvorbis import OggVorbis
import json

audio = OggVorbis("morceau_stems.ogg")

pistes    = json.loads(audio["BANDES_PISTES"][0])
structure = json.loads(audio["BANDES_STRUCTURE"][0])
accords   = json.loads(audio["BANDES_ACCORDS"][0])
metadata  = json.loads(audio["BANDES_METADATA"][0])
releves   = json.loads(audio["BANDES_RELEVES"][0])
```

Note : avec `mutagen`, chaque tag est une **liste** de valeurs (les Vorbis Comments
autorisent plusieurs valeurs pour une même clé) — on accède donc à `[0]` pour récupérer
la chaîne JSON.

### Écriture / modification

```python
from mutagen.oggvorbis import OggVorbis
import json

audio = OggVorbis("morceau_stems.ogg")
audio["BANDES_RELEVES"] = json.dumps(nouveaux_releves, ensure_ascii=False)
audio.save()
```

Chaque tag peut être réécrit indépendamment des autres (ex : le portail peut modifier
uniquement `BANDES_RELEVES` sans toucher au reste).

## 3. Schéma de chaque tag

### `BANDES_PISTES`
Liste ordonnée des noms de stems présents, dans l'ordre réel des canaux du fichier.

```json
["vocals", "drums", "bass", "other"]
```

### `BANDES_STRUCTURE`
```json
{
  "bpm": 118.4,
  "beats": [0.33, 0.75, 1.14, 1.55],
  "beat_positions": [1, 2, 3, 4],
  "downbeats": [0.33, 1.94, 3.53],
  "segments": [
    { "start": 0.0,   "end": 0.33,  "label": "start" },
    { "start": 0.33,  "end": 13.13, "label": "intro" },
    { "start": 13.13, "end": 37.53, "label": "chorus" },
    { "start": 37.53, "end": 51.53, "label": "verse" }
  ]
}
```

- `beats` / `downbeats` : timestamps en secondes
- `beat_positions` : position dans la mesure pour chaque `beat` correspondant (1 = temps fort)
- `segments` : sections fonctionnelles du morceau (`start`, `end` en secondes, `label` parmi
  `start`, `intro`, `verse`, `chorus`, `bridge`, `outro`, `end`, selon le vocabulaire du
  modèle `all-in-one`)

### `BANDES_ACCORDS`
Timeline d'accords (notation Harte simplifiée : `"A#"` = la# majeur, `"A#:min"` = la# mineur, `"N"` = silence/pas d'accord).

```json
[
  { "start": 0.0,   "end": 1.481, "chord": "N"  },
  { "start": 1.481, "end": 3.981, "chord": "A#" },
  { "start": 3.981, "end": 7.2,   "chord": "D:min" }
]
```

### `BANDES_METADATA`
Informations générales du morceau (formulaire principal).

```json
{
  "nom_fichier": "dupont_clair_de_lune.wav",
  "eleve": "Camille Dupont",
  "prof": "M. Martin",
  "morceau": "Clair de lune",
  "artiste": "Debussy",
  "tonalite": "Ré bémol majeur",
  "niveau": { "cycle": "2e cycle", "echelle": "5" },
  "commentaire": "Travailler le legato mesures 12-16",
  "date": "2026-09-14"
}
```

Tous les champs sont des chaînes de texte simples (y compris `niveau.echelle`, stocké
comme texte même si c'est un nombre entre 1 et 8). Un champ non renseigné est une
chaîne vide `""`, jamais `null` ni absent — le portail doit générer toutes les clés
ci-dessus à chaque fois, même vides. `niveau.cycle` est en texte libre (les
conventions de cycle variant selon les conservatoires) ; `niveau.echelle` est une
valeur parmi `"1"` à `"8"`, ou `""`.

### `BANDES_RELEVES`
Section dédiée aux relevés pédagogiques, structurée par instrument. C'est cette
section que le portail (formulaire prof) est destiné à remplir ou modifier.

```json
[
  {
    "instrument": "batterie",
    "sous_titre": "Intro et couplet 1",
    "marqueurs": [
      { "temps": "0:12", "texte": "Fill de caisse claire, anticiper d'une croche" },
      { "temps": "0:45", "texte": "Charleston ouvert sur le refrain" }
    ]
  },
  {
    "instrument": "guitare",
    "sous_titre": "Pont",
    "marqueurs": [
      { "temps": "1:30", "texte": "Barré fa a la 1ere case, bien etouffer la corde de mi grave" }
    ]
  }
]
```

**Règles :**
- `instrument` : texte libre (pas de liste fermée — "batterie", "guitare", "violon",
  "piano", ou toute autre valeur pertinente)
- Un morceau peut avoir zéro, un ou plusieurs blocs instrument
- Un bloc instrument peut avoir zéro, un ou plusieurs marqueurs
- `temps` : texte libre, convention recommandée `mm:ss` (ex: `"1:30"`), mais le champ
  n'est pas validé/parsé automatiquement — à interpréter côté portail si besoin d'un
  tri chronologique ou d'une navigation par timestamp
- `texte` : la note/consigne pédagogique associée à ce point du morceau

## 5. Extensions prévues (à implémenter côté portail élève)

Ces champs ne sont **pas encore présents** dans `BANDES_RELEVES` — ils sont prévus pour
être ajoutés directement par le portail élève, car ils concernent le suivi de l'élève
sur le relevé lui-même, pas le morceau :

- **Niveau de maîtrise par marqueur** — ex : `"a_travailler"` / `"en_cours"` / `"acquis"`
- **Auteur et date du relevé** — qui a rempli ce relevé précis et quand (distinct de la
  date du morceau dans `BANDES_METADATA`)
- **Statut du relevé** — brouillon / validé

Suggestion de schéma pour le portail élève lorsqu'il implémentera ces champs (à ajuster
librement) :

```json
{
  "instrument": "batterie",
  "sous_titre": "Intro et couplet 1",
  "auteur": "Camille Dupont",
  "date_releve": "2026-09-20",
  "statut": "en_cours",
  "marqueurs": [
    { "temps": "0:12", "texte": "Fill de caisse claire", "maitrise": "acquis" },
    { "temps": "0:45", "texte": "Charleston ouvert", "maitrise": "a_travailler" }
  ]
}
```

## 6. Résumé des clés

| Tag | Contenu | Rempli par |
|---|---|---|
| `BANDES_PISTES` | Ordre des stems dans les canaux | Généré automatiquement (notebook) |
| `BANDES_STRUCTURE` | BPM | Généré automatiquement (all-in-one) |
| `BANDES_ACCORDS` | Timeline d'accords | Généré automatiquement (BTC) |
| `BANDES_METADATA` | Infos générales du morceau | App « Bandes » (formulaire élève/prof) |
| `BANDES_RELEVES` | Relevés pédagogiques par instrument | **Portail prof** (à implémenter) |
