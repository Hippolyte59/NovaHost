# NovaHost  Template d''hébergement moderne (2026)

Template simple, moderne et accessible pour page d''hébergement (VPS, Cloud, Serveurs dédiés).

##  Structure du projet

```
novahost/
 index.html          # Page principale bien structurée et sémantique
 styles.css          # Styles modernes (variables CSS, responsive, commentés)
 main.js             # JavaScript bien organisé avec commentaires (thème, nav, tarification)
 README.md           # Ce fichier
 LICENSE             # Licence MIT
 docs/               # Dossier de documentation
     index.html      # Documentation des API
     api.html        # Exemples d''intégration
```

##  Caractéristiques

### Fonctionnalités intégrées

- **Thème clair/sombre** : Basculement avec sauvegarde localStorage
- **Navigation mobile** : Menu responsive avec focus trap pour accessibilité
- **Tarification dynamique** : Basculer mensuel/annuel avec animations fluides
- **Calculateur de ressources** : Simulateur de vCPU/RAM/Stockage en temps réel
- **Estimation rapide** : Sélection de plan et calcul du prix total
- **Animations** : Reveal au scroll, ripple sur boutons, micro-interactions 3D
- **Notifications** : Système de toast pour feedback utilisateur
- **Formulaires** : Contact et newsletter avec validation
- **Accessibilité** : WCAG 2.1, focus visible, ARIA labels, keyboard navigation

### Design

- Mode sombre/clair avec variables CSS
- Palette gradient moderne (accent vert/violet)
- Responsive design (mobile, tablet, desktop)
- Micro-interactions fluides (sans réduire motion pour accessibilité)
- Icons SVG intégrés

##  Installation & Utilisation

### Démarrage rapide

1. **Cloner ou télécharger** le projet
2. **Ouvrir `index.html`** dans le navigateur
3. **Utiliser Live Server** (optionnel) :
   ```bash
   # VS Code : clic droit > Open with Live Server
   # Ou utiliser un autre serveur local
   ```

### Personnalisation

#### 1. Couleurs & Thème

Modifier les variables CSS dans `styles.css` (section `:root`) :

```css
:root {
  --accent: #6ee7b7;      /* Couleur principale (vert) */
  --accent-2: #7c6cff;    /* Couleur secondaire (violet) */
  --bg: #0b1020;          /* Fond sombre */
  --card: #0f1724;        /* Cartes */
  --muted: #9aa4b2;       /* Texte secondaire */
}
```

#### 2. Contenu & Texte

- Modifier le titre/description dans `<head>`
- Mettre à jour les sections (Fonctionnalités, Tarification, etc.)
- Remplacer les emojis/icons par vos ressources

#### 3. Tarification

Éditer les plans dans `index.html` (section Tarification) :

```html
<div class="card" data-plan="starter" data-monthly="5" data-annual="54">
  <!-- data-monthly: prix mensuel -->
  <!-- data-annual: prix annuel (10% de réduction) -->
</div>
```

#### 4. Formulaires

Connecter les formulaires à votre backend/service email :

- Contact form : `#contactForm` (voir `main.js` ligne ~450)
- Newsletter : `#newsletterForm` (voir `main.js` ligne ~480)

##  CSS - Organisation

Le CSS est bien structuré avec sections commentées :

```
 Variables CSS (thème, couleurs)
 Reset & styles de base
 Accessibilité (skip-link, sr-only, focus)
 Header & Navigation
 Boutons & interactions
 Hero section
 Fonctionnalités
 Tarification
 Contact & Footer
 Animations
 Responsive design
 Accessibilité motion
 Impression
```

##  JavaScript - Organisation

Le code est organisé en 12 modules :

```
1. Utilitaires (animateNumber, animateAmount)
2. Année dynamique
3. Thème (mode clair/sombre)
4. Navigation mobile & focus trap
5. Effet ripple sur boutons
6. Micro-interaction 3D
7. Tarification (mensuel/annuel)
8. Calculateur de ressources
9. Sélection de plans & estimation
10. Toast / Notifications
11. Formulaire de contact
12. Animations d''apparition (reveal)
```

Tous les modules ont des commentaires clairs.

##  Accessibilité

 WCAG 2.1 Level AA

- Navigation au clavier (Tab, Shift+Tab, Escape, Enter)
- ARIA labels sur tous les contrôles
- `role="region"` sur sections principales
- `aria-live` pour mises à jour dynamiques
- `skip-link` pour aller au contenu
- Focus trap sur menu mobile
- Respect de `prefers-reduced-motion`
- Contraste suffisant (4.5:1 minimum)

##  Responsive Design

- **Desktop** : Pleine largeur (max 1200px)
- **Tablet** : Grille 2 colonnes (900px)
- **Mobile** : Pleine largeur (520px)
- Navigation mobile avec hamburger menu

##  Performance

- CSS minifié et organisé
- JavaScript sans dépendances externes
- Images SVG (pas d''exports PNG lourds)
- Animations optimisées (will-change, GPU)
- Lazy loading potentiel pour futures images

##  Fichiers clés

| Fichier | Description |
|---------|-------------|
| `index.html` | Structure HTML sémantique, formulaires accessibles |
| `styles.css` | 1000+ lignes de CSS bien commenté |
| `main.js` | ~600 lignes de JS propre avec commentaires |
| `docs/api.html` | Documentation des endpoints (futur) |

##  Suggestions d''amélioration

- [ ] Remplacer les SVG placeholder par des illustrations réelles
- [ ] Ajouter animation SVG avec Lottie (optionnel)
- [ ] Intégrer backend de tarification (API)
- [ ] Tests d''accessibilité avec Lighthouse
- [ ] Ajouter du contenu réel (descriptions, témoignages)
- [ ] Implémenter la persistence des formulaires
- [ ] Ajouter PWA (manifest.json, service worker)
- [ ] Multi-langue i18n

##  Licence

MIT  voir `LICENSE` pour le texte complet.

Libre d''utilisation à titre personnel ou commercial.

---

**Dernière mise à jour** : 15 janvier 2026

Construit avec  pour les développeurs.
