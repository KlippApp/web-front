# Klipp Landing Page (web-front)

Ce projet est la page de destination de l'application mobile **Klipp**. Il est construit avec React 19, Vite 7 et Tailwind CSS v4.

## 📧 Gestion des Emails

Le projet utilise **React Email** pour concevoir des templates d'emails modernes et responsives (Light/Dark mode) en utilisant des composants React.

### Commandes pour les Emails

| Commande | Description |
| :--- | :--- |
| `npm run email` | Lance le serveur de prévisualisation local (http://localhost:3000) |
| `npm run email:export` | Génère les fichiers HTML statiques inlinés dans `dist/emails/` |

### Workflow de Design

1.  Modifiez ou créez des templates dans `src/emails/`.
2.  Utilisez `npm run email` pour voir le rendu en temps réel.
3.  Pour tester l'envoi réel, utilisez l'interface de prévisualisation avec une clé API **Resend**.
4.  Une fois le design validé, lancez `npm run email:export`.
5.  Récupérez le code HTML généré pour l'intégrer dans le backend FastAPI (Jinja2).

## 🚀 Développement Local

```bash
npm install        # Installation des dépendances
npm run dev        # Lancement du serveur de développement (Vite)
npm run build      # Création du build de production
npm run lint       # Vérification du code avec ESLint
```

## 🌐 Déploiement

Le projet est déployé par Railway (service `web-front`) à chaque push sur `main` une fois la CI passée, sur [klippapps.com](https://klippapps.com).
L'URL de l'API est fournie par la variable `VITE_API_URL` du service Railway.
