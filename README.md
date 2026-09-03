# INSTASON - BACKEND

Backend Node.js pour la generation de chansons personnalisees via l'API Suno.

## Structure

```
backend/
├── server.js              # Serveur Express principal
├── package.json           # Dependances
├── .env                   # Variables d'environnement (SECRET)
├── .env.example           # Modele de configuration
├── routes/
│   └── api.js            # Routes API
└── services/
    ├── sunoService.js    # Service API Suno
    └── emailService.js   # Service d'envoi d'emails
```

## Installation

1. **Installer Node.js** (version 18+)
   ```bash
   node -v
   ```

2. **Installer les dependances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Editer .env avec vos vraies cles
   ```

4. **Lancer le serveur**
   ```bash
   npm start
   ```

## Configuration (.env)

```
# CLE API SUNO - OBLIGATOIRE
SUNO_API_KEY=votre_cle_api_suno

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe

# URLs
FRONTEND_URL=https://votre-site.com
SERVER_URL=https://votre-backend.com
```

## API Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/order` | Creer une commande |
| POST | `/api/generate` | Lancer la generation |
| GET | `/api/status/:orderId` | Verifier le statut |
| POST | `/api/webhook/suno` | Webhook Suno |

## Deploiement

### Option 1 : Hostinger (VPS uniquement)
- Le plan partage de Hostinger NE SUPPORTE PAS Node.js
- Il faut un VPS Hostinger ou un plan Cloud

### Option 2 : Render (GRATUIT)
1. Creer un compte sur render.com
2. Connecter votre repo GitHub
3. Deployer en quelques clics

### Option 3 : Railway (GRATUIT)
1. Creer un compte sur railway.app
2. Deployer depuis GitHub

### Option 4 : Vercel (Serverless)
- Adapter le code pour les fonctions serverless

## IMPORTANT SECURITE

- NE JAMAIS committer le fichier `.env`
- NE JAMAIS exposer la cle API Suno publiquement
- Utiliser toujours HTTPS en production
- Stocker les cles dans les variables d'environnement du serveur

## Fonctionnement

1. Le client remplit le questionnaire (frontend)
2. Les donnees sont envoyees au backend (`POST /api/order`)
3. Le paiement est traite (Stripe)
4. Le backend appelle l'API Suno (`POST /api/generate`)
5. Suno genere la chanson (peut prendre quelques minutes)
6. Quand la chanson est prete, Suno appelle le webhook
7. Le backend envoie l'email avec le lien de telechargement
